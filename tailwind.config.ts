import type { Config } from "tailwindcss";

// ---------------------------------------------------------------------------
// BALZAC ANTIQUES — design tokens
// Derived directly from client reference screenshots. Do not change these
// values without client sign-off — the client is strict about visual match.
// ---------------------------------------------------------------------------
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F3EA",      // page background
        parchment: "#F1EBDD",  // secondary section background
        ink: "#2B2420",        // primary text / near-black brown
        charcoal: "#1C1712",   // BUY NOW button / darkest surface
        gold: "#B08D57",       // primary accent — eyebrows, links, borders
        "gold-dark": "#8C6C3F",// gold hover / pressed state
        hairline: "#E4DCC8",   // dividers, card borders
      },
      fontFamily: {
        display: ["var(--font-baskerville)", "Georgia", "serif"],
        body: ["var(--font-jost)", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
