import type { Metadata } from "next";
import Page from "@/app/contact/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "Contact · Balzac Antiques",
  description:
    "Demandes concernant notre collection, recherches d'objets ou acquisitions privées.",
  alternates: altsFr("/contact"),
};

export default Page;
