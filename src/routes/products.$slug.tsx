import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShieldCheck, Truck, Zap } from "lucide-react";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} — VoltDot` },
      { name: "description", content: loaderData?.product.tagline ?? "" },
      { property: "og:title", content: `${loaderData?.product.name ?? "Product"} — VoltDot` },
      { property: "og:description", content: loaderData?.product.tagline ?? "" },
      { property: "og:image", content: loaderData?.product.image ?? "" },
      { name: "twitter:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Product not found</h1>
      <Link to="/shop" className="text-mint hover:underline">← Back to shop</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const related = products.filter((p) => p.collection === product.collection && p.slug !== product.slug).slice(0, 3);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-mint">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-mint">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
            {product.badge && (
              <span className="absolute left-5 top-5 rounded-full bg-mint px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint-foreground">
                {product.badge}
              </span>
            )}
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col">
            <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">
              {product.collection.toUpperCase()}
            </p>
            <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-3">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.tagline}</p>

            <div className="flex items-end gap-3 mb-8">
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
              )}
              <span className="text-3xl font-semibold text-mint">{formatPrice(product.price)}</span>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8 grid grid-cols-2 gap-3">
              {product.specs.map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-medium">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-12 w-12 place-items-center hover:text-mint"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-12 w-12 place-items-center hover:text-mint"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => add(product, qty)}
                className="flex-1 rounded-full bg-mint py-4 font-display tracking-widest text-mint-foreground hover:opacity-90 transition"
              >
                ADD TO CART
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                { icon: ShieldCheck, t: "12-Mo Warranty" },
                { icon: Truck, t: "Free Shipping" },
                { icon: Zap, t: "GaN III" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <b.icon className="h-5 w-5 text-mint" />
                  <span className="text-xs text-muted-foreground">{b.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
          <h2 className="font-display text-3xl tracking-wide mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
