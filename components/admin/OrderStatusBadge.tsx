// Small status chip shared by the orders list and the order detail page.
const STYLES: Record<string, string> = {
  pending: "border-[#B99A5B]/50 bg-[#F4E9D4] text-[#6B5326]",
  paid: "border-[#5B7A5B]/50 bg-[#EAF0E6] text-[#3E5A3E]",
  shipped: "border-[#5B6E7A]/50 bg-[#E6EDF0] text-[#3E4F5A]",
  delivered: "border-[#8B8578]/40 bg-[#EFECE4] text-[#5C574C]",
  cancelled: "border-[#C0736A]/50 bg-[#FBEDEA] text-[#8A3C3C]",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${STYLES[status] ?? STYLES.pending}`}>
      {status}
    </span>
  );
}
