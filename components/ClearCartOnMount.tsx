"use client";

// Mounted on the order-confirmation page: the order is placed, so the local
// cart empties itself (and the header badge with it).
//
// The `ready` gate is load-bearing. This component is a CHILD of CartProvider,
// and React runs child effects first, so clearing on plain mount would empty
// the provider's starting state and then be undone the moment the provider
// hydrates from localStorage. That is invisible on an in-app navigation, where
// the provider is already hydrated, but happens on every full page load, which
// is exactly what returning from the Stripe payment page is.
import { useEffect } from "react";
import { useCart } from "@/components/Cart";

export default function ClearCartOnMount() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (!ready) return;
    clear();
  }, [ready, clear]);
  return null;
}
