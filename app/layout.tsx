import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Jost } from "next/font/google";
import "./globals.css";

const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://balzacantiques.ch"),
  title: "Balzac Antiques — Rare Objects. Timeless Stories.",
  description:
    "A curated destination for rare and timeless objects: rare books, vintage vinyl, fine watches, artworks, iconic design and carefully selected collectibles, sourced across Europe and Asia.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Balzac Antiques",
    title: "Balzac Antiques — Rare Objects. Timeless Stories.",
    description:
      "Rare books, fine watches, artworks, vinyl and remarkable objects, curated in Bangkok for collectors worldwide.",
    url: "https://balzacantiques.ch",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Balzac Antiques" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Balzac Antiques — Rare Objects. Timeless Stories.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EA",
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
