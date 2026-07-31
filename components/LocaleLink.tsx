"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePrefs } from "@/components/Prefs";
import { isLocalized, toFr } from "@/lib/locale-routes";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

// Internal link that keeps the visitor inside their language. When French is
// active, an English path is rewritten to its French twin, so a visitor who
// lands on /fr never gets bounced back into the English tree by the first link
// they click, and crawlers see French pages linking to French pages.
// Paths with no French twin (cart, checkout, account) are left untouched, and
// a path that is already French is left alone too.
export default function LocaleLink({ href, ...rest }: Props) {
  const { locale } = usePrefs();
  const target = locale === "fr" && isLocalized(href) ? toFr(href) ?? href : href;
  return <Link href={target} {...rest} />;
}
