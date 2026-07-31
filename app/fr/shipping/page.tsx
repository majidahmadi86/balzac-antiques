import type { Metadata } from "next";
import Page from "@/app/shipping/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "Livraison · Balzac Antiques",
  alternates: altsFr("/shipping"),
};

export default Page;
