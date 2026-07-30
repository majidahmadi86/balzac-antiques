import Link from "next/link";
import { logout } from "../../app/admin/login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/account", label: "Account" },
];

// Mobile: logo left + Sign Out top-right on the first row, nav links on their
// own divided row beneath. From sm up: the original single row (logo, nav,
// email, Sign Out) exactly as before.
export default function AdminHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E4DCCB] bg-[#F7F3EA]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/admin" className="block">
          <p className="font-serif text-[19px] tracking-[0.26em] text-[#1F1B16] -mr-[0.26em]">BALZAC</p>
          <p className="text-[9px] tracking-[0.4em] text-[#8A7A5C] -mr-[0.4em]">ADMIN</p>
        </Link>

        <div className="ml-auto flex items-center gap-5 sm:order-last">
          <span className="hidden text-[12px] tracking-[0.06em] text-[#6B6154] md:inline">{email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="whitespace-nowrap border border-[#D8CFBB] bg-white px-3 py-2 text-[9px] tracking-[0.18em] uppercase text-[#1F1B16] transition-colors hover:border-[#B99A5B] sm:px-4 sm:text-[10px] sm:tracking-[0.24em]"
            >
              Sign Out
            </button>
          </form>
        </div>

        <nav className="order-last mt-3 flex w-full flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#EFE9DA] pt-3 sm:order-none sm:ml-10 sm:mt-0 sm:w-auto sm:border-0 sm:pt-0 sm:gap-6">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[10px] tracking-[0.24em] uppercase text-[#6B6154] transition-colors hover:text-[#1F1B16]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
