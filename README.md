# Balzac Antiques — website build

Custom Next.js 14 (App Router) + Tailwind, built to match the client's two
reference screenshots pixel-for-pixel in layout, type, and color.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Also included: `preview.html` — a single static HTML file with no build
step, for a fast visual sanity-check in any browser before wiring up the
full Next.js app.

## What's built (this pass)

- **Homepage** (`app/page.tsx`) — hero, "Featured / Exceptional Pieces"
  4-up category grid, auction banner, trust-badge footer. Matches
  reference image 1.
- **Product detail page** (`app/product/[id]/page.tsx`) — gallery +
  thumbnails, spec table, price panel with Add to Cart / Buy Now,
  accordion sections. Matches reference image 2.
- **Design tokens** locked in `tailwind.config.ts` — cream/parchment/ink/
  gold palette read directly off the screenshots, Libre Baskerville
  (display) + Jost (body) fonts, letter-spacing scale for the small-caps
  labels used throughout.
- Shared `Header` and `TrustBadges` components so both pages (and every
  page after) stay pixel-consistent automatically.

## Not yet built — remaining contract scope

These are real, separately-sized pieces of the 25,000 THB scope, not
forgotten:

1. **Bilingual EN/FR** — no i18n routing wired up yet. Recommend
   `next-intl` with `/en/...` and `/fr/...` routes so every string above
   (including the placeholder copy) becomes a translation key.
2. **Admin panel** — add/edit/delete products (photo, title, description,
   price, category), phone-uploadable, changes live instantly. This
   needs a database (Postgres via Neon/Supabase recommended) plus an
   authenticated `/admin` route. `lib/data.ts` is intentionally shaped so
   swapping it for real queries doesn't change the page components.
3. **Stripe checkout** — Add to Cart / Buy Now are currently static
   buttons with no cart or payment logic behind them.
4. **"Sell With Us" form** — simple photo + description email submission,
   not built yet.
5. **Collection/browse, cart, and account pages** — linked to from the
   header and category cards, not yet built.
6. Real product photography — every image in `public/images/` is a
   labelled placeholder SVG generated for this pass; swap for the
   client's actual photos before anything goes live.

## Notes for Composer

- Node 18+, standard `next build && next start` (or deploy target of
  choice — Vercel is the path of least friction for Next.js; if the
  client's Hostinger plan doesn't support Node, we'll need a Node-capable
  host or static export, which would break the future Stripe/admin work
  — flag this back to Mike before committing to hosting).
- Fonts load from Google Fonts at build time via `next/font/google` — no
  extra setup needed, but the build **requires internet access** to
  `fonts.googleapis.com` / `fonts.gstatic.com`.
- `npm run build` has been verified to compile cleanly (all routes
  prerender, zero type errors). The only build failure seen in
  development was the sandbox's network allowlist blocking Google Fonts —
  not a code issue.
