import { Star } from "lucide-react";

const reviews = [
  { name: "Ali R.", text: "Tiny brick, charges my MacBook + iPhone simultaneously. Build quality is excellent.", product: "Dot GaN 65W Pro" },
  { name: "Sara K.", text: "Finally a local brand that actually delivers on charging speed claims. Love it.", product: "Dot GaN 30W" },
  { name: "Hamza M.", text: "Braided cable feels premium and hasn't frayed after 6 months of daily use.", product: "Thread USB-C Cable" },
  { name: "Mariam I.", text: "Slim power bank with a display — perfect for travel. Charges fast too.", product: "Stack 10,000" },
];

export function Reviews() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">LOVED BY 50,000+ CUSTOMERS</p>
          <h2 className="font-display text-4xl md:text-6xl tracking-wide">WHAT PEOPLE SAY</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-mint text-mint" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
