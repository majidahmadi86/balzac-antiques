import type { Metadata } from "next";
import "./globals.css";
import { PrefsProvider } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "Balzac Antiques",
  description: "x",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body bg-cream text-ink antialiased">
        <PrefsProvider>{children}</PrefsProvider>
      </body>
    </html>
  );
}
