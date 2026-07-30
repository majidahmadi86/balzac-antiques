"use client";

// Mounted on the order-confirmation page: the order is placed, so the local
// cart empties itself (and the header badge with it).
import { useEffect } from "react";
import { useCart } from "@/components/Cart";

export default function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
