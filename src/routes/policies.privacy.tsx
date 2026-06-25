import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — VoltDot" }, { name: "description", content: "How VoltDot collects, uses and protects your personal information." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">LEGAL</p>
      <h1 className="font-display text-5xl tracking-wide mb-8">PRIVACY POLICY</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p>This Privacy Policy describes how VoltDot ("we", "us", or "our") collects, uses, and shares personal information when you visit, use, or make a purchase from our store.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Information We Collect</h2>
        <p>We collect information you provide when placing an order — name, shipping address, email, phone number and payment details — along with device and usage information automatically gathered through cookies.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">How We Use Your Information</h2>
        <p>To fulfil orders, process payments, send order updates, respond to support requests, prevent fraud, and (with your consent) send marketing communications you can unsubscribe from at any time.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Sharing</h2>
        <p>We share information with delivery partners, payment processors (such as Stripe) and analytics providers strictly to operate the store. We do not sell personal data.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Your Rights</h2>
        <p>You can request access, correction or deletion of your personal data at any time by emailing <a className="text-mint" href="mailto:support@voltdot.pk">support@voltdot.pk</a>.</p>
      </div>
    </div>
  );
}
