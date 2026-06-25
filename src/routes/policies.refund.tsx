import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/refund")({
  head: () => ({ meta: [{ title: "Refund & Returns Policy — VoltDot" }, { name: "description", content: "7-day returns and warranty replacements for VoltDot orders." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">LEGAL</p>
      <h1 className="font-display text-5xl tracking-wide mb-8">REFUND & RETURNS</h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>We want you to love your VoltDot product. If something isn't right, our 7-day return policy has you covered.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Eligibility</h2>
        <p>Items must be returned within 7 days of delivery in original packaging, unused and with all accessories included.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Warranty Claims</h2>
        <p>Manufacturing defects within the 12-month warranty period are repaired or replaced free of charge. Share a short video of the issue with your order ID to <a className="text-mint" href="mailto:support@voltdot.pk">support@voltdot.pk</a>.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Refund Timeline</h2>
        <p>Once we receive and inspect the returned item, refunds are processed within 5–7 working days to the original payment method.</p>
      </div>
    </div>
  );
}
