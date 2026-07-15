import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PrefsProvider } from "@/components/Prefs";

// Fonts are SELF-HOSTED (woff2 files committed in app/fonts/). Previously
// loaded from Google Fonts at build time — when that fetch failed on the
// production server, Next silently fell back to system fonts and the whole
// site shipped with the wrong typography. Self-hosting removes the network
// dependency entirely: builds are reproducible anywhere, offline included.
const baskerville = localFont({
  src: [
    { path: "./fonts/libre-baskerville-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/libre-baskerville-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/libre-baskerville-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-baskerville",
  display: "swap",
});

const jost = localFont({
  src: [
    { path: "./fonts/jost-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/jost-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jost-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/jost-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
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
      "Rare books, fine watches, artworks, vinyl and remarkable objects, curated for collectors worldwide.",
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
        <PrefsProvider>{children}</PrefsProvider>
      </body>
    </html>
  );
}
