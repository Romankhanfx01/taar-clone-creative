import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Order confirmed — VoltDot" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

function Success() {
  const { clear } = useCart();
  useEffect(() => { clear(); }, [clear]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-mint" />
      <h1 className="mt-6 font-display text-4xl md:text-5xl tracking-wide">THANK YOU</h1>
      <p className="mt-4 text-muted-foreground">
        Your payment is confirmed and your order is being processed. You'll receive an email with tracking details shortly.
      </p>
      <Link to="/shop" className="mt-8 inline-block rounded-full bg-mint px-8 py-3 font-display tracking-widest text-mint-foreground">
        CONTINUE SHOPPING
      </Link>
    </div>
  );
}
