import { createFileRoute } from "@tanstack/react-router";
import { api, getApiBase, getAdminToken } from "@/lib/api.server";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.STRIPE_SECRET_KEY;
        const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!key || !whSecret) {
          return new Response("Stripe not configured", { status: 503 });
        }
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(key);

        const sig = request.headers.get("stripe-signature");
        if (!sig) return new Response("Missing signature", { status: 400 });

        const raw = await request.text();
        let event;
        try {
          event = await stripe.webhooks.constructEventAsync(raw, sig, whSecret);
        } catch (err) {
          console.error("Webhook signature failure:", err);
          return new Response("Bad signature", { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data.object as any;
          try {
            const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
            if (getApiBase() && getAdminToken()) {
              await api("/admin/orders", {
                method: "POST",
                admin: true,
                body: {
                  stripe_session_id: session.id,
                  stripe_payment_intent: session.payment_intent,
                  email: session.customer_details?.email ?? session.customer_email,
                  amount_total: session.amount_total,
                  currency: session.currency,
                  items: items.data.map((li: any) => ({
                    name: li.description,
                    quantity: li.quantity,
                    amount_total: li.amount_total,
                  })),
                  shipping: session.shipping_details ?? null,
                },
              });
            } else {
              console.log("Order received (API not configured):", session.id);
            }
          } catch (e) {
            console.error("Order forward failed:", e);
            return new Response("Order forward failed", { status: 500 });
          }
        }

        return new Response("ok");
      },
    },
  },
});
