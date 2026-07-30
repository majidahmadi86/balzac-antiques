import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Shipping · Balzac Antiques",
};

const sections: LegalSection[] = [
  {
    hEn: "Worldwide, piece by piece",
    hFr: "Dans le monde entier, pièce par pièce",
    pEn: [
      "The gallery ships worldwide. Because every piece is unique in size, weight and fragility, shipping is arranged individually for each order rather than at a flat rate.",
    ],
    pFr: [
      "La galerie livre dans le monde entier. Chaque pièce étant unique par sa taille, son poids et sa fragilité, la livraison est organisée individuellement pour chaque commande plutôt qu'à tarif forfaitaire.",
    ],
  },
  {
    hEn: "Costs, quoted before you pay",
    hFr: "Frais chiffrés avant paiement",
    pEn: [
      "After you place an order, the gallery contacts you with the exact shipping cost to your address, together with the invoice. Nothing is charged until you have accepted the total including shipping.",
    ],
    pFr: [
      "Après votre commande, la galerie vous communique le coût exact de la livraison à votre adresse, avec la facture. Rien n'est encaissé avant votre accord sur le total, livraison comprise.",
    ],
  },
  {
    hEn: "Packing and insurance",
    hFr: "Emballage et assurance",
    pEn: [
      "Pieces are packed professionally for their nature: rigid tubes or flat packing for works on paper, protective crating where a piece requires it. Shipments are sent with tracking and insured for the purchase price unless agreed otherwise.",
    ],
    pFr: [
      "Les pièces sont emballées de manière professionnelle selon leur nature : tubes rigides ou emballage à plat pour les œuvres sur papier, caisse de protection lorsque la pièce l'exige. Les envois sont suivis et assurés à hauteur du prix d'achat, sauf accord contraire.",
    ],
  },
  {
    hEn: "Delivery times",
    hFr: "Délais de livraison",
    pEn: [
      "Dispatch normally takes place within five working days of payment. Transit times depend on the destination and the carrier and are indicated with the shipping quote.",
    ],
    pFr: [
      "L'expédition intervient normalement sous cinq jours ouvrés après paiement. Les délais d'acheminement dépendent de la destination et du transporteur; ils sont indiqués avec le devis de livraison.",
    ],
  },
  {
    hEn: "Customs and import taxes",
    hFr: "Douane et taxes d'importation",
    pEn: [
      "Any customs duties, import VAT or handling fees levied by the destination country are the buyer's responsibility and are not included in the price or the shipping cost.",
    ],
    pFr: [
      "Les droits de douane, la TVA à l'importation ou les frais de dossier prélevés par le pays de destination sont à la charge de l'acheteur et ne sont inclus ni dans le prix ni dans les frais de livraison.",
    ],
  },
];

export default function ShippingPage() {
  return <LegalPage titleEn="Shipping" titleFr="Livraison" sections={sections} />;
}
