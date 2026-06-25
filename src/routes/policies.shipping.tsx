import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/shipping")({
  head: () => ({ meta: [{ title: "Shipping Policy — VoltDot" }, { name: "description", content: "Delivery timelines, charges and tracking for VoltDot orders across Pakistan." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">LEGAL</p>
      <h1 className="font-display text-5xl tracking-wide mb-8">SHIPPING POLICY</h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>We ship Pakistan-wide via trusted courier partners. Orders placed before 3:00 PM PKT on a working day are dispatched the same day.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Delivery Time</h2>
        <p>Major cities: 1–3 working days. Other locations: 3–5 working days. A tracking link is emailed once your order is dispatched.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Charges</h2>
        <p>Flat-rate delivery of Rs. 250. Free shipping on orders over Rs. 5,000.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Cash on Delivery</h2>
        <p>COD is available on all orders within Pakistan. Please keep exact change ready for the rider.</p>
      </div>
    </div>
  );
}
