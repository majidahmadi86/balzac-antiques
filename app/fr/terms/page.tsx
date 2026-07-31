import type { Metadata } from "next";
import Page from "@/app/terms/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "Conditions de vente · Balzac Antiques",
  alternates: altsFr("/terms"),
};

export default Page;
