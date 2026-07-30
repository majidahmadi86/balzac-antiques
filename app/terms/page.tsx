import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Sale · Balzac Antiques",
};

// PLACEHOLDERS pending the client's business details: [LEGAL ENTITY NAME],
// [REGISTERED ADDRESS], [JURISDICTION]. Fill before final launch sign-off.
const sections: LegalSection[] = [
  {
    hEn: "1. Who we are",
    hFr: "1. Qui nous sommes",
    pEn: [
      "balzacantiques.ch is operated by Balzac Antiques ([LEGAL ENTITY NAME], [REGISTERED ADDRESS]), referred to below as \"the gallery\". These terms govern every order placed through this website. By placing an order you accept them.",
    ],
    pFr: [
      "balzacantiques.ch est exploité par Balzac Antiques ([LEGAL ENTITY NAME], [REGISTERED ADDRESS]), ci-après \"la galerie\". Les présentes conditions régissent toute commande passée sur ce site. En passant commande, vous les acceptez.",
    ],
  },
  {
    hEn: "2. The pieces",
    hFr: "2. Les pièces",
    pEn: [
      "Every piece offered is a unique antique or collectable, sold in the condition described on its page. Descriptions, dates, attributions and condition notes are given in good faith and to the best of the gallery's knowledge. Age-related wear consistent with the stated condition is inherent to antiques and does not constitute a defect.",
    ],
    pFr: [
      "Chaque pièce proposée est une antiquité ou un objet de collection unique, vendu dans l'état décrit sur sa page. Les descriptions, datations, attributions et notes d'état sont données de bonne foi, au mieux des connaissances de la galerie. L'usure liée à l'âge, conforme à l'état indiqué, est inhérente aux antiquités et ne constitue pas un défaut.",
    ],
  },
  {
    hEn: "3. Prices and currency",
    hFr: "3. Prix et devise",
    pEn: [
      "Prices are set in euros (EUR). Amounts shown in other currencies are indicative conversions for convenience; the invoiced amount is the EUR price. Prices do not include shipping, which is quoted separately before payment, nor any customs duties or import taxes of the destination country, which are the buyer's responsibility.",
    ],
    pFr: [
      "Les prix sont fixés en euros (EUR). Les montants affichés dans d'autres devises sont des conversions indicatives; le montant facturé est le prix en EUR. Les prix n'incluent ni la livraison, chiffrée séparément avant paiement, ni les éventuels droits de douane ou taxes d'importation du pays de destination, qui restent à la charge de l'acheteur.",
    ],
  },
  {
    hEn: "4. Ordering and reservation",
    hFr: "4. Commande et réservation",
    pEn: [
      "Placing an order through the website reserves the piece for you and is a request to purchase, not yet a concluded sale. The gallery will contact you, normally within two working days, to confirm availability, quote shipping and arrange payment. The sale is concluded when the gallery confirms the order and full payment is received.",
      "If a reservation cannot be honoured, for example because a piece was sold in the showroom at the same moment, the gallery will inform you promptly and any amount already paid will be refunded in full.",
    ],
    pFr: [
      "Passer commande sur le site réserve la pièce pour vous et constitue une demande d'achat, non encore une vente conclue. La galerie vous contactera, normalement sous deux jours ouvrés, pour confirmer la disponibilité, chiffrer la livraison et organiser le paiement. La vente est conclue lorsque la galerie confirme la commande et que le paiement intégral est reçu.",
      "Si une réservation ne peut être honorée, par exemple parce qu'une pièce a été vendue en boutique au même moment, la galerie vous en informera rapidement et tout montant déjà versé sera intégralement remboursé.",
    ],
  },
  {
    hEn: "5. Payment",
    hFr: "5. Paiement",
    pEn: [
      "Payment is made against the gallery's invoice using the methods offered at the time, such as PayPal or bank transfer. Ownership of a piece passes to the buyer once full payment has been received. The gallery does not store card details; payments are processed by the payment provider.",
    ],
    pFr: [
      "Le paiement s'effectue sur facture de la galerie, par les moyens proposés au moment de la vente, tels que PayPal ou virement bancaire. La propriété d'une pièce est transférée à l'acheteur à réception du paiement intégral. La galerie ne conserve aucune donnée de carte; les paiements sont traités par le prestataire de paiement.",
    ],
  },
  {
    hEn: "6. Shipping",
    hFr: "6. Livraison",
    pEn: [
      "Shipping is arranged individually for each piece and is described in the Shipping policy, which forms part of these terms.",
    ],
    pFr: [
      "La livraison est organisée individuellement pour chaque pièce et décrite dans la politique de Livraison, qui fait partie des présentes conditions.",
    ],
  },
  {
    hEn: "7. Returns",
    hFr: "7. Retours",
    pEn: [
      "Returns and damage in transit are governed by the Returns policy, which forms part of these terms.",
    ],
    pFr: [
      "Les retours et les dommages de transport sont régis par la politique de Retours, qui fait partie des présentes conditions.",
    ],
  },
  {
    hEn: "8. Governing law and contact",
    hFr: "8. Droit applicable et contact",
    pEn: [
      "These terms are governed by the law of [JURISDICTION]. Questions about an order or these terms: use the Contact page and the gallery will respond by email.",
    ],
    pFr: [
      "Les présentes conditions sont régies par le droit de [JURISDICTION]. Pour toute question concernant une commande ou les présentes conditions, utilisez la page Contact; la galerie vous répondra par e-mail.",
    ],
  },
];

export default function TermsPage() {
  return <LegalPage titleEn="Terms of Sale" titleFr="Conditions de vente" sections={sections} />;
}
