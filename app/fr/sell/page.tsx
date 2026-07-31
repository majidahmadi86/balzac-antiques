import type { Metadata } from "next";
import Page from "@/app/sell/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "Acquisitions · Balzac Antiques",
  description:
    "Balzac Antiques recherche activement livres rares, œuvres d'art, montres vintage, disques vinyles, design iconique, arts décoratifs et objets de collection.",
  alternates: altsFr("/sell"),
};

export default Page;
