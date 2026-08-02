import type { Metadata } from "next";
import { alts } from "@/lib/locale-routes";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Returns · Balzac Antiques",
  alternates: alts("/returns"),
};

// The client confirmed on 1 August 2026 that all sales are final. The page is
// kept rather than removed: it is linked from the footer in both languages and
// listed in locale-routes and the sitemap, and a shop with no returns page at
// all reads as evasive to a buyer looking for one before they commit.
const sections: LegalSection[] = [
  {
    hEn: "All sales are final",
    hFr: "Toutes les ventes sont fermes",
    pEn: [
      "Every piece is a unique antique or collectable, sold in the condition described on its page. The gallery does not accept returns, exchanges or refunds.",
      "Please read the description and the condition notes carefully before you buy, and ask anything you are unsure about. The gallery will gladly send further photographs or details of any piece on request.",
    ],
    pFr: [
      "Chaque pièce est une antiquité ou un objet de collection unique, vendu dans l'état décrit sur sa page. La galerie n'accepte ni retour, ni échange, ni remboursement.",
      "Merci de lire attentivement la description et les notes d'état avant d'acheter, et de poser toute question utile. La galerie vous enverra volontiers des photographies ou des précisions supplémentaires sur simple demande.",
    ],
  },
  {
    hEn: "The wear of age",
    hFr: "L'usure du temps",
    pEn: [
      "Antiques carry the marks of their years. Patina, earlier restoration and the condition notes stated on a piece's page are part of what is being sold and are not faults.",
    ],
    pFr: [
      "Les antiquités portent les marques du temps. La patine, les restaurations anciennes et les notes d'état indiquées sur la page d'une pièce font partie de ce qui est vendu et ne constituent pas des défauts.",
    ],
  },
  {
    hEn: "Damaged in transit",
    hFr: "Dommage pendant le transport",
    pEn: [
      "If a piece arrives damaged, keep all of the packaging and tell the gallery within 48 hours, with photographs, so that a claim can be made against the carrier's insurance. The gallery will pursue the claim with the carrier on your behalf.",
    ],
    pFr: [
      "Si une pièce arrive endommagée, conservez l'intégralité de l'emballage et prévenez la galerie sous 48 heures, photos à l'appui, afin qu'une déclaration puisse être faite auprès de l'assurance du transporteur. La galerie suivra le dossier avec le transporteur pour vous.",
    ],
  },
];

export default function ReturnsPage() {
  return <LegalPage titleEn="Returns" titleFr="Retours" sections={sections} />;
}
