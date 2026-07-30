// Bilingual status chip for the customer-facing order history.
import { T } from "@/components/Prefs";

const KEY: Record<string, string> = {
  pending: "status.pending",
  paid: "status.paid",
  shipped: "status.shipped",
  delivered: "status.delivered",
  cancelled: "status.cancelled",
};

const STYLE: Record<string, string> = {
  pending: "border-gold/50 bg-[#F4E9D4] text-[#6B5326]",
  paid: "border-[#5B7A5B]/50 bg-[#EAF0E6] text-[#3E5A3E]",
  shipped: "border-[#5B6E7A]/50 bg-[#E6EDF0] text-[#3E4F5A]",
  delivered: "border-hairline bg-parchment text-ink/70",
  cancelled: "border-[#C0736A]/50 bg-[#FBEDEA] text-[#8A3C3C]",
};

export default function OrderStatusChip({ status }: { status: string }) {
  return (
    <span className={`inline-block border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${STYLE[status] ?? STYLE.pending}`}>
      <T k={KEY[status] ?? KEY.pending} />
    </span>
  );
}
