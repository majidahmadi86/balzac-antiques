import type { Metadata } from "next";
import { alts } from "@/lib/locale-routes";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Sale · Balzac Antiques",
  alternates: alts("/terms"),
};

// Operator name and the no-returns position confirmed by the client on
// 1 August 2026. The client also removed the governing-law sentence from
// clause 8, so that heading is Contact rather than Governing law and contact.
const sections: LegalSection[] = [
  {
    hEn: "1. Who we are",
    hFr: "1. Qui nous sommes",
    pEn: [
      "balzacantiques.ch is operated by Balzac Antiques Co Ltd, referred to below as \"the gallery\". These terms govern every order placed through this website. By placing an order you accept them.",
    ],
    pFr: [
      "balzacantiques.ch est exploité par Balzac Antiques Co Ltd, ci-après \"la galerie\". Les présentes conditions régissent toute commande passée sur ce site. En passant commande, vous les acceptez.",
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
      "Prices are set in euros (EUR). Amounts shown in other currencies are indicative conversions for convenience; the amount charged is the EUR price. Prices do not include shipping, which the gallery quotes separately once the destination is known, nor any customs duties or import taxes of the destination country, which are the buyer's responsibility.",
    ],
    pFr: [
      "Les prix sont fixés en euros (EUR). Les montants affichés dans d'autres devises sont des conversions indicatives; le montant débité est le prix en EUR. Les prix n'incluent ni la livraison, que la galerie chiffre séparément une fois la destination connue, ni les éventuels droits de douane ou taxes d'importation du pays de destination, qui restent à la charge de l'acheteur.",
    ],
  },
  {
    hEn: "4. Ordering",
    hFr: "4. Commande",
    pEn: [
      "Placing an order through the website reserves the piece for you. Payment for the piece is taken at that point by card, and the sale is concluded once the payment is received. The gallery will then contact you, normally within two working days, to confirm the piece is on its way and to quote shipping to your address.",
      "If an order cannot be fulfilled, for example because a piece was sold in the showroom at the same moment, the gallery will inform you promptly and refund the amount paid in full.",
    ],
    pFr: [
      "Passer commande sur le site réserve la pièce pour vous. Le paiement de la pièce est alors effectué par carte, et la vente est conclue dès réception de ce paiement. La galerie vous contactera ensuite, normalement sous deux jours ouvrés, pour confirmer l'expédition et chiffrer la livraison jusqu'à votre adresse.",
      "Si une commande ne peut être honorée, par exemple parce qu'une pièce a été vendue en boutique au même moment, la galerie vous en informera rapidement et vous remboursera intégralement le montant versé.",
    ],
  },
  {
    hEn: "5. Payment",
    hFr: "5. Paiement",
    pEn: [
      "Payment is made by card at checkout and is processed by Stripe, our payment provider. The gallery never sees or stores your card details. Ownership of a piece passes to the buyer once payment has been received. For a purchase arranged outside the website, the gallery may instead invoice for payment by bank transfer.",
    ],
    pFr: [
      "Le paiement s'effectue par carte au moment de la commande et est traité par Stripe, notre prestataire de paiement. La galerie ne voit ni ne conserve aucune donnée de carte. La propriété d'une pièce est transférée à l'acheteur dès réception du paiement. Pour un achat convenu en dehors du site, la galerie peut établir une facture réglée par virement bancaire.",
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
      "All sales are final. The gallery does not accept returns, exchanges or refunds. Damage in transit is handled under the Returns policy, which forms part of these terms.",
    ],
    pFr: [
      "Toutes les ventes sont fermes. La galerie n'accepte ni retour, ni échange, ni remboursement. Les dommages survenus pendant le transport sont traités selon la politique de Retours, qui fait partie des présentes conditions.",
    ],
  },
  {
    hEn: "8. Contact",
    hFr: "8. Contact",
    pEn: [
      "Questions about an order or these terms: use the Contact page and the gallery will respond by email.",
    ],
    pFr: [
      "Pour toute question concernant une commande ou les présentes conditions, utilisez la page Contact; la galerie vous répondra par e-mail.",
    ],
  },
];

export default function TermsPage() {
  return <LegalPage titleEn="Terms of Sale" titleFr="Conditions de vente" sections={sections} />;
}
