import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export const Route = createFileRoute("/checkout/cancel")({
  head: () => ({
    meta: [
      { title: "Checkout cancelled — VoltDot" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <XCircle className="mx-auto h-16 w-16 text-muted-foreground" />
      <h1 className="mt-6 font-display text-4xl tracking-wide">CHECKOUT CANCELLED</h1>
      <p className="mt-4 text-muted-foreground">No worries — your cart is still saved.</p>
      <Link to="/shop" className="mt-8 inline-block rounded-full border border-mint px-8 py-3 font-display tracking-widest text-mint">
        BACK TO SHOP
      </Link>
    </div>
  ),
});
