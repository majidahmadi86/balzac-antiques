import { PrefsProvider } from "@/components/Prefs";

// Everything under /fr renders in French regardless of the visitor's stored
// preference: here the URL owns the language, which is what makes these pages
// indexable as French pages. This nested provider overrides the root one for
// this subtree only, so the rest of the site is untouched.
export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return <PrefsProvider forceLocale="fr">{children}</PrefsProvider>;
}
