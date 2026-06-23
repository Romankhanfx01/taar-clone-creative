import { ShieldCheck, Truck, Zap, RefreshCw } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "12-Month Warranty", desc: "Hassle-free replacement on every product." },
  { icon: Truck, title: "Free Shipping", desc: "On all orders over Rs. 5,000 nationwide." },
  { icon: Zap, title: "GaN III Technology", desc: "Faster, smaller, cooler than legacy chargers." },
  { icon: RefreshCw, title: "7-Day Returns", desc: "Changed your mind? Send it back, no questions." },
];

export function FeatureGrid() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-4 bg-background p-8">
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-mint/10 text-mint">
              <f.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg tracking-wide mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
