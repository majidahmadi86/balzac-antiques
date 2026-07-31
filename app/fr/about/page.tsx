import type { Metadata } from "next";
import Page from "@/app/about/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "À propos · Balzac Antiques",
  description:
    "Balzac Antiques est une destination choisie pour les objets rares et intemporels, sourcés en Europe et en Asie.",
  alternates: altsFr("/about"),
};

export default Page;
