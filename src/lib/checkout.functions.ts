import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { z } from "zod";

const cartItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  price: z.number().int().positive(),
  qty: z.number().int().positive(),
  image: z.string().optional(),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ items: z.array(cartItemSchema).min(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("Stripe is not configured yet. Add STRIPE_SECRET_KEY in project secrets.");
    }
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(key);

    const host = getRequestHost();
    const origin = `https://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: data.items.map((i) => ({
        quantity: i.qty,
        price_data: {
          currency: "pkr",
          unit_amount: i.price * 100, // price in PKR rupees → paisa
          product_data: {
            name: i.name,
            metadata: { slug: i.slug },
          },
        },
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      shipping_address_collection: { allowed_countries: ["PK"] },
    });

    return { url: session.url };
  });
