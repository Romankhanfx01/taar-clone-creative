import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { Minus, Plus, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { createCheckoutSession } from "@/lib/checkout.functions";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty, subtotal } = useCart();
  const checkout = useServerFn(createCheckoutSession);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function startCheckout() {
    setErr(null);
    setLoading(true);
    try {
      const res = await checkout({
        data: {
          items: items.map((i) => ({
            slug: i.product.slug,
            name: i.product.name,
            price: i.product.price,
            qty: i.qty,
            image: i.product.image,
          })),
        },
      });
      if (res.url) window.location.href = res.url;
    } catch (e: any) {
      setErr(e?.message ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Cart"
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-2xl tracking-widest">CART</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="hover:text-mint transition">
            <X className="h-6 w-6" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-muted-foreground">Your cart is currently empty.</p>
            <p className="text-sm text-muted-foreground">Not sure where to start?</p>
            <a href="/shop" className="mt-2 text-mint underline underline-offset-4">
              Browse all products
            </a>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5">
            <ul className="flex flex-col gap-5">
              {items.map((i) => (
                <li key={i.product.slug} className="flex gap-4 border-b border-border pb-5">
                  <img src={i.product.image} alt={i.product.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <span className="font-medium">{i.product.name}</span>
                      <button onClick={() => remove(i.product.slug)} className="text-xs text-muted-foreground hover:text-destructive">
                        Remove
                      </button>
                    </div>
                    <span className="text-sm text-mint">{formatPrice(i.product.price)}</span>
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.product.slug, i.qty - 1)}
                        className="grid h-7 w-7 place-items-center rounded border border-border hover:border-mint"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button
                        onClick={() => setQty(i.product.slug, i.qty + 1)}
                        className="grid h-7 w-7 place-items-center rounded border border-border hover:border-mint"
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="border-t border-border p-5">
          <div className="mb-3 flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">Taxes and shipping calculated at checkout</p>
          {err && <p className="mb-3 text-xs text-destructive">{err}</p>}
          <button
            onClick={startCheckout}
            disabled={items.length === 0 || loading}
            className="w-full rounded-full bg-mint py-4 font-display tracking-widest text-mint-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "REDIRECTING…" : "CHECK OUT"}
          </button>
        </footer>
      </aside>
    </>
  );
}
