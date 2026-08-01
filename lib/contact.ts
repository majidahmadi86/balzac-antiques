// The gallery's public contact address, in one place.
//
// It is shown on the Contact page, in the mobile menu and on the Sell page.
// Keeping it here means changing it is a single edit and no copy of it can be
// left behind, which is exactly how the previous address survived in three
// files at once.
//
// Note this is the address VISITORS see. It is not where the site's forms
// deliver: those go to ENQUIRY_TO in .env, sent through Resend from
// ENQUIRY_FROM on send.balzacantiques.ch.

export const CONTACT_EMAIL = "balzacsantiques@gmail.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
