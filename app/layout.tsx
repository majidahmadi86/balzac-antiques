import type { Metadata } from "next";
import { Libre_Baskerville, Jost } from "next/font/google";
import "./globals.css";

// Display face — used ONLY for the logo wordmark and headings, per client
// direction ("Baskerville family"). Libre Baskerville is the open-license
// web equivalent; swap for licensed Baskerville if the client supplies one.
const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

// Body / UI face
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Balzac Antiques — Rare Books, Fine Watches & Curiosities",
  description:
    "Discover remarkable objects: rare books, fine watches, vintage posters and curiosities, curated by Balzac Antiques, Bangkok.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baskerville.variable} ${jost.variable}`}>
      <body className="font-body bg-cream text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
