// Outgoing email via Resend. Sending only: the gallery receives enquiries in
// its normal inbox, and Reply-To is set to the visitor so a reply goes
// straight back to them.
//
// Deliberately fail-soft: if RESEND_API_KEY or ENQUIRY_TO is not configured,
// or Resend errors, nothing throws. The submission is already saved in the
// database and visible in the admin Messages panel, so a lead is never lost
// because of a mail problem.

import { Resend } from "resend";

type Enquiry = {
  kind: "contact" | "sell";
  name: string;
  email: string;
  phone?: string | null;
  body: string;
  photoUrls?: string[];
};

const SITE = "https://balzacantiques.ch";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendEnquiryEmail(e: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO;
  const from = process.env.ENQUIRY_FROM;
  if (!apiKey || !to || !from) return; // not configured yet

  const isSell = e.kind === "sell";
  const subject = isSell
    ? `Piece offered: ${e.name}`
    : `Website enquiry: ${e.name}`;

  const photoHtml =
    e.photoUrls && e.photoUrls.length > 0
      ? `<p style="margin:18px 0 6px;font:600 12px/1.4 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8A7A5C">Photographs</p>` +
        e.photoUrls
          .map(
            (u) =>
              `<p style="margin:0 0 8px"><a href="${SITE}${esc(u)}" style="color:#8A6A2F">${SITE}${esc(u)}</a></p>`
          )
          .join("")
      : "";

  const html = `
    <div style="font:400 15px/1.65 system-ui,-apple-system,sans-serif;color:#1F1B16;max-width:600px">
      <p style="margin:0 0 4px;font:600 12px/1.4 system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#8A7A5C">
        ${isSell ? "Piece offered through Acquisitions" : "Enquiry from the Contact page"}
      </p>
      <h2 style="margin:0 0 18px;font:400 22px/1.3 Georgia,serif;color:#1F1B16">${esc(e.name)}</h2>
      <p style="margin:0 0 4px"><strong>Email:</strong> <a href="mailto:${esc(e.email)}" style="color:#8A6A2F">${esc(e.email)}</a></p>
      ${e.phone ? `<p style="margin:0 0 4px"><strong>Phone:</strong> ${esc(e.phone)}</p>` : ""}
      <p style="margin:18px 0 6px;font:600 12px/1.4 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8A7A5C">Message</p>
      <p style="margin:0;white-space:pre-wrap">${esc(e.body)}</p>
      ${photoHtml}
      <p style="margin:26px 0 0;padding-top:14px;border-top:1px solid #E4DCCB;font-size:13px;color:#6B6154">
        Reply to this email to answer ${esc(e.name)} directly. You can also manage it at
        <a href="${SITE}/admin/messages" style="color:#8A6A2F">${SITE}/admin/messages</a>.
      </p>
    </div>`;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: [to],
    replyTo: e.email,
    subject,
    html,
  });
}
