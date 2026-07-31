import type { Metadata } from "next";
import Page from "@/app/collection/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "La collection · Balzac Antiques",
  description:
    "Livres rares, montres de belle facture, œuvres d'art, disques vinyles, design iconique et objets remarquables, choisis par Balzac Antiques.",
  alternates: altsFr("/collection"),
};

export default Page;
