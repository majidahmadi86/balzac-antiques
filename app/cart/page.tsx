import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your Cart · Balzac Antiques",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <CartView />
      </div>
      <Footer />
    </main>
  );
}
