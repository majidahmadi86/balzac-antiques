import type { Metadata } from "next";
import Page from "@/app/privacy/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "Politique de confidentialité · Balzac Antiques",
  alternates: altsFr("/privacy"),
};

export default Page;
