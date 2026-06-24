import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <div className="rounded-xl border border-border bg-card p-8">
      <h2 className="font-display text-2xl tracking-wide">WELCOME</h2>
      <p className="mt-2 text-muted-foreground">
        Pick a section from the left to manage your store. All changes are persisted to your MySQL API.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link to="/admin/products" className="rounded-lg border border-border p-4 hover:border-mint">
          <p className="font-display text-lg">PRODUCTS</p>
          <p className="text-sm text-muted-foreground">Add, edit, delete products and images.</p>
        </Link>
        <Link to="/admin/orders" className="rounded-lg border border-border p-4 hover:border-mint">
          <p className="font-display text-lg">ORDERS</p>
          <p className="text-sm text-muted-foreground">Track Stripe orders &amp; statuses.</p>
        </Link>
        <Link to="/admin/content" className="rounded-lg border border-border p-4 hover:border-mint">
          <p className="font-display text-lg">CONTENT</p>
          <p className="text-sm text-muted-foreground">Hero slides, reviews &amp; announcement bar.</p>
        </Link>
      </div>
    </div>
  ),
});
