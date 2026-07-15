"use client";

import { usePrefs } from "@/components/Prefs";

const badges: { keys: [string, string]; icon: JSX.Element }[] = [
  {
    keys: ["badge.ship1", "badge.ship2"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
  },
  {
    keys: ["badge.auth1", "badge.auth2"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    keys: ["badge.advice1", "badge.advice2"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 13a8 8 0 0 1 16 0"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect x="3" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
];

export default function TrustBadges() {
  const { t } = usePrefs();
  return (
    <div className="grid grid-cols-3 divide-x divide-hairline border-t border-hairline bg-cream py-6 text-center">
      {badges.map((b) => (
        <div key={b.keys.join(" ")} className="flex flex-col items-center gap-2 px-1">
          <span className="text-gold">{b.icon}</span>
          <span className="text-[10px] leading-tight tracking-[0.1em] text-ink">
            {b.keys.map((k) => (
              <span key={k} className="block uppercase">
                {t(k)}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
