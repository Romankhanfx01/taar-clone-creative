import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — VoltDot" }, { name: "description", content: "Answers to common questions about VoltDot chargers, warranty, shipping and returns." }] }),
  component: Page,
});

const faqs = [
  { q: "Are VoltDot chargers safe for my iPhone or MacBook?", a: "Yes. Every charger is built with GaN III technology and certified PD protocols, so they negotiate the safe wattage with your device automatically." },
  { q: "How long is the warranty?", a: "All VoltDot products carry a 12-month warranty against manufacturing defects. Register your product in your account to speed up claims." },
  { q: "Do you offer Cash on Delivery?", a: "Yes — COD is available on every order shipped within Pakistan." },
  { q: "How fast is delivery?", a: "1–3 working days for major cities and 3–5 working days elsewhere. A tracking link is shared once the order is dispatched." },
  { q: "Can I return a product I don't like?", a: "You can return any unused product in original packaging within 7 days of delivery for a full refund." },
  { q: "Do cables support data transfer?", a: "Yes, all USB-C cables support USB 2.0 480Mbps data transfer alongside fast charging." },
];

function Page() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-12">
      <div className="mb-12 text-center">
        <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">SUPPORT</p>
        <h1 className="font-display text-5xl tracking-wide">FREQUENTLY ASKED</h1>
      </div>
      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="rounded-xl border border-border bg-card">
              <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <span className="font-display tracking-wide text-lg">{f.q}</span>
                <ChevronDown className={`h-5 w-5 text-mint transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
