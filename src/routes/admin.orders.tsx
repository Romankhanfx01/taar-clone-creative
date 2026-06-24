import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
  component: () => (
    <div className="rounded-xl border border-border bg-card p-8">
      <h2 className="font-display text-2xl tracking-wide">ORDERS</h2>
      <p className="mt-2 text-muted-foreground">
        Orders flow in automatically from Stripe (via the webhook) and are stored in your <code>orders</code> table.
        Wire this page to <code>GET /admin/orders</code> when your API is ready — same pattern as the Products page.
      </p>
    </div>
  ),
});
