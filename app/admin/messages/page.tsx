import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { db } from "@/lib/db";
import { setMessageHandled } from "./actions";

export const metadata: Metadata = {
  title: "Messages · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  kind: string;
  name: string | null;
  email: string;
  phone: string | null;
  body: string | null;
  photos: string | null;
  handled: boolean;
  createdAt: Date;
};

export default async function AdminMessagesPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const email = session?.email ?? "";

  const enquiries: Row[] = await db.message.findMany({
    where: { kind: { in: ["contact", "sell"] } },
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
    take: 300,
  });
  const subscribers: Row[] = await db.message.findMany({
    where: { kind: "newsletter" },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  const openCount = enquiries.filter((m) => !m.handled).length;

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-[26px] text-[#1F1B16]">Messages</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B6154]">
          Enquiries from the Contact page and pieces offered through Acquisitions. Reply from your own email by
          clicking the address, then mark the message as done so you can see what is still waiting.
          {openCount > 0 ? ` You have ${openCount} waiting.` : ""}
        </p>

        {enquiries.length === 0 ? (
          <p className="mt-10 border border-[#E4DCCB] bg-white/70 px-6 py-8 text-[14px] text-[#6B6154]">
            No messages yet. Anything sent through the Contact or Acquisitions pages will appear here.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4">
            {enquiries.map((m) => (
              <li
                key={m.id}
                className={`border p-5 ${m.handled ? "border-[#EFE9DA] bg-white/40" : "border-[#E4DCCB] bg-white/70"}`}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span
                    className={`border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${
                      m.kind === "sell"
                        ? "border-[#B99A5B]/50 bg-[#F4E9D4] text-[#6B5326]"
                        : "border-[#5B6E7A]/40 bg-[#E6EDF0] text-[#3E4F5A]"
                    }`}
                  >
                    {m.kind === "sell" ? "Offering a piece" : "Enquiry"}
                  </span>
                  {m.handled ? (
                    <span className="border border-[#EFE9DA] px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-[#9A8F7D]">
                      Done
                    </span>
                  ) : null}
                  <span className="ml-auto text-[12px] text-[#9A8F7D]">
                    {m.createdAt.toISOString().slice(0, 10)}
                  </span>
                </div>

                <p className="mt-3 text-[15px] text-[#1F1B16]">{m.name}</p>
                <p className="break-all text-[13px] text-[#6B6154]">
                  <a href={`mailto:${m.email}`} className="underline underline-offset-2 hover:text-[#1F1B16]">
                    {m.email}
                  </a>
                  {m.phone ? <span className="text-[#9A8F7D]"> · {m.phone}</span> : null}
                </p>

                {m.photos ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.photos.split(",").map((src) => (
                      <a key={src} href={src} target="_blank" rel="noreferrer" className="block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="h-24 w-24 border border-[#E4DCCB] object-cover" />
                      </a>
                    ))}
                  </div>
                ) : null}

                {m.body ? (
                  <p className="mt-3 whitespace-pre-wrap border-t border-[#EFE9DA] pt-3 text-[14px] leading-relaxed text-[#1F1B16]">
                    {m.body}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(
                      m.kind === "sell"
                        ? "Re: the piece you offered to Balzac Antiques"
                        : "Re: your enquiry to Balzac Antiques"
                    )}&body=${encodeURIComponent(`Dear ${m.name ?? ""},\n\n`)}`}
                    className="bg-[#1F1B16] px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-[#F7F3EA] transition-colors hover:bg-[#3A322A]"
                  >
                    Reply by email
                  </a>
                  <form action={setMessageHandled}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="handled" value={m.handled ? "false" : "true"} />
                    <button
                      type="submit"
                      className="border border-[#D8CFBB] bg-white px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-[#1F1B16] transition-colors hover:border-[#B99A5B]"
                    >
                      {m.handled ? "Reopen" : "Mark as done"}
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-14 font-serif text-[20px] text-[#1F1B16]">
          Newsletter ({subscribers.length})
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[#6B6154]">
          Addresses collected from the footer signup.
        </p>
        {subscribers.length === 0 ? (
          <p className="mt-4 border border-[#E4DCCB] bg-white/70 px-5 py-6 text-[14px] text-[#6B6154]">
            No signups yet.
          </p>
        ) : (
          <ul className="mt-4 border border-[#E4DCCB] bg-white/70 p-5 text-[13px] leading-relaxed text-[#1F1B16]">
            {subscribers.map((s) => (
              <li key={s.id} className="break-all border-b border-[#EFE9DA] py-1.5 last:border-0">
                {s.email}
                <span className="text-[#9A8F7D]"> · {s.createdAt.toISOString().slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
