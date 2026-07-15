export default function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="mx-auto max-w-content px-6 pb-4 pt-14 text-center sm:px-10 sm:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-display text-[32px] leading-tight text-ink sm:text-[42px]">
        {title}
      </h1>
      <div className="mx-auto my-6 h-px w-12 bg-gold" />
      {lead ? (
        <p className="mx-auto max-w-[54ch] font-display text-[18px] italic leading-relaxed text-ink/80 sm:text-[20px]">
          {lead}
        </p>
      ) : null}
    </section>
  );
}
