import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Returns · Balzac Antiques",
};

// [RETURN WINDOW] placeholder: 14 days drafted; confirm with the client.
const sections: LegalSection[] = [
  {
    hEn: "On arrival",
    hFr: "À la réception",
    pEn: [
      "Please inspect your piece as soon as it arrives. If it has been damaged in transit, keep all packaging and report it to the gallery within 48 hours with photographs, so the insurance claim can be made. The gallery will then work with you towards repair, replacement where possible, or a refund.",
    ],
    pFr: [
      "Veuillez examiner votre pièce dès sa réception. En cas de dommage pendant le transport, conservez l'intégralité de l'emballage et signalez-le à la galerie sous 48 heures, photos à l'appui, afin que la déclaration d'assurance puisse être faite. La galerie recherchera alors avec vous une réparation, un remplacement lorsque c'est possible, ou un remboursement.",
    ],
  },
  {
    hEn: "Returns",
    hFr: "Retours",
    pEn: [
      "If a piece is not as described, or you change your mind, you may return it within [RETURN WINDOW] days of delivery. Contact the gallery first via the Contact page to arrange the return; the piece must come back in the condition in which it was delivered, packed with equivalent care.",
      "Where the return is due to an error in the description, the gallery bears the return shipping. Where you change your mind, return shipping and insurance are at your cost.",
    ],
    pFr: [
      "Si une pièce n'est pas conforme à sa description, ou si vous changez d'avis, vous pouvez la retourner dans un délai de [RETURN WINDOW] jours après la livraison. Contactez d'abord la galerie via la page Contact pour organiser le retour; la pièce doit revenir dans l'état où elle a été livrée, emballée avec un soin équivalent.",
      "Lorsque le retour est dû à une erreur de description, la galerie prend en charge les frais de retour. En cas de simple changement d'avis, les frais de retour et d'assurance sont à votre charge.",
    ],
  },
  {
    hEn: "Refunds",
    hFr: "Remboursements",
    pEn: [
      "Once the returned piece has arrived and been checked, the refund is issued by the same method as the original payment, normally within ten working days.",
    ],
    pFr: [
      "Dès réception et vérification de la pièce retournée, le remboursement est effectué par le même moyen que le paiement d'origine, normalement sous dix jours ouvrés.",
    ],
  },
  {
    hEn: "What a return cannot cover",
    hFr: "Ce qu'un retour ne peut pas couvrir",
    pEn: [
      "Antiques are sold as described, with the wear of their age. Characteristics stated on the piece's page, such as condition notes, patina or restoration, are part of the description and are not grounds for return.",
    ],
    pFr: [
      "Les antiquités sont vendues telles que décrites, avec l'usure de leur âge. Les caractéristiques indiquées sur la page de la pièce, comme les notes d'état, la patine ou les restaurations, font partie de la description et ne constituent pas un motif de retour.",
    ],
  },
];

export default function ReturnsPage() {
  return <LegalPage titleEn="Returns" titleFr="Retours" sections={sections} />;
}
