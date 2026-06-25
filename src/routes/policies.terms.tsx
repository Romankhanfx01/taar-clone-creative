import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/policies/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — VoltDot" }, { name: "description", content: "The terms that govern your use of the VoltDot store." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">LEGAL</p>
      <h1 className="font-display text-5xl tracking-wide mb-8">TERMS OF SERVICE</h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>By accessing or using the VoltDot website you agree to be bound by these Terms. If you do not agree, please do not use the site.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Orders & Pricing</h2>
        <p>All orders are subject to availability and confirmation. Prices are listed in PKR and may change without notice. We reserve the right to cancel any order at our discretion, including for suspected fraud.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Warranty</h2>
        <p>VoltDot products carry a 12-month limited warranty against manufacturing defects. The warranty does not cover physical damage, misuse, or unauthorized repairs.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Intellectual Property</h2>
        <p>All content on this site — including logos, designs, copy and photography — is the property of VoltDot and may not be copied without written consent.</p>
        <h2 className="text-foreground font-display tracking-wide text-2xl">Contact</h2>
        <p>Questions about these terms? Reach us at <a className="text-mint" href="mailto:support@voltdot.pk">support@voltdot.pk</a>.</p>
      </div>
    </div>
  );
}
