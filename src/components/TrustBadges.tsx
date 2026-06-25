import { Truck, RotateCcw, ShieldCheck, Banknote } from "lucide-react";

const items = [
  { Icon: Banknote, t: "Cash on Delivery", s: "Pay when you receive" },
  { Icon: Truck, t: "Pakistan-wide Shipping", s: "2–4 day delivery" },
  { Icon: RotateCcw, t: "7-Day Easy Returns", s: "No-questions refund" },
  { Icon: ShieldCheck, t: "12-Month Warranty", s: "Hassle-free claims" },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-8 md:grid-cols-4 lg:px-12">
        {items.map(({ Icon, t, s }) => (
          <div key={t} className="flex items-center gap-3">
            <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border border-mint/40 bg-mint/10 text-mint">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-xs text-muted-foreground">{s}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
