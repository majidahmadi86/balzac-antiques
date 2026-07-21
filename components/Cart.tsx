"use client";

// Client-side cart. Antiques are quantity-one, so the cart is a set of pieces
// keyed by slug (no quantities). Stored in localStorage and hydrated on load,
// like site preferences. Availability is authoritative at checkout, where the
// server re-checks each piece before reserving it.
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartItem = {
  slug: string;
  titleEn: string;
  titleFr: string | null;
  priceEur: number;
  image: string | null;
  categorySlug: string;
  categoryLabelEn: string;
  categoryLabelFr: string | null;
};

type CartValue = {
  items: CartItem[];
  count: number;
  ready: boolean;
  has: (slug: string) => boolean;
  add: (item: CartItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartValue>({
  items: [],
  count: 0,
  ready: false,
  has: () => false,
  add: () => {},
  remove: () => {},
  clear: () => {},
});

const KEY = "balzac-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((x): x is CartItem => !!x && typeof (x as CartItem).slug === "string"));
        }
      }
    } catch {
      // ignore malformed storage
    }
    setReady(true);
  }, []);

  // Persist after every change, but only once the initial load has run so we
  // never overwrite a saved cart with the empty starting state.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [items, ready]);

  const add = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((x) => x.slug === item.slug) ? prev : [...prev, item]));
  }, []);
  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((slug: string) => items.some((x) => x.slug === slug), [items]);

  return (
    <Ctx.Provider value={{ items, count: items.length, ready, has, add, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
