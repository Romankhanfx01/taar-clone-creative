export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-card/40 py-5">
      <div className="flex w-max animate-marquee gap-12">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-display text-2xl tracking-[0.25em] text-muted-foreground whitespace-nowrap"
          >
            {t} <span className="ml-12 text-mint">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
