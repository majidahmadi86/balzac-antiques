import type { Metadata } from "next";
import Page from "@/app/returns/page";
import { altsFr } from "@/lib/locale-routes";

export const metadata: Metadata = {
  title: "Retours · Balzac Antiques",
  alternates: altsFr("/returns"),
};

export default Page;
