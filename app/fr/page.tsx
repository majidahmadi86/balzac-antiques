import type { Metadata } from "next";
import Page from "@/app/page";
import { altsFr } from "@/lib/locale-routes";

// French twin of the homepage.
export const metadata: Metadata = {
  title: "Balzac Antiques · Objets rares. Histoires intemporelles.",
  description:
    "Livres rares, montres de belle facture et objets remarquables, sourcés et authentifiés à Bangkok pour les collectionneurs du monde entier.",
  alternates: altsFr("/"),
};

export default Page;
