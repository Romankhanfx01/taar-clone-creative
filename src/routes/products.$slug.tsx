import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Minus, Plus, ShieldCheck, Truck, Zap, Heart, Share2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, listProducts } from "@/lib/products.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";

const productQO = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }) });
const allQO = queryOptions({ queryKey: ["products"], queryFn: () => listProducts({ data: {} }) });

const RV_KEY = "voltdot.recentlyViewed.v1";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQO(params.slug));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(allQO);
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    return {
      meta: [
        { title: `${p.name} — VoltDot` },
        { name: "description", content: p.tagline },
        { property: "og:title", content: `${p.name} — VoltDot` },
        { property: "og:description", content: p.tagline },
        { property: "og:image", content: p.image },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.image },
      ],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description,
          image: p.image,
          brand: { "@type": "Brand", name: "VoltDot" },
          offers: {
            "@type": "Offer",
            priceCurrency: "PKR",
            price: p.price,
            availability: "https://schema.org/InStock",
          },
        }),
      }],
    };
  },
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
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQO(slug));
  const { data: all } = useSuspenseQuery(allQO);
  const { add, setOpen } = useCart();
  const { has, toggle } = useWishlist();
  const checkout = useServerFn(createCheckoutSession);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [buying, setBuying] = useState(false);

  // Recently viewed tracking
  useEffect(() => {
    if (!product) return;
    try {
      const raw = localStorage.getItem(RV_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const next = [product.slug, ...list.filter((s) => s !== product.slug)].slice(0, 8);
      localStorage.setItem(RV_KEY, JSON.stringify(next));
    } catch {}
  }, [product?.slug]);

  if (!product) return null;

  const wished = has(product.slug);
  const images = [product.image, product.image, product.image]; // gallery placeholder using single image
  const related = all.filter((p) => p.collection === product.collection && p.slug !== product.slug).slice(0, 4);

  // Recently viewed (excluding current)
  let recentlyViewed: typeof all = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(RV_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      recentlyViewed = list
        .filter((s) => s !== product.slug)
        .map((s) => all.find((p) => p.slug === s))
        .filter((p): p is NonNullable<typeof p> => !!p)
        .slice(0, 4);
    } catch {}
  }

  async function buyNow() {
    setBuying(true);
    try {
      const res = await checkout({
        data: { items: [{ slug: product!.slug, name: product!.name, price: product!.price, qty, image: product!.image }] },
      });
      if (res.url) window.location.href = res.url;
    } catch {
      add(product!, qty);
      setOpen(true);
    } finally {
      setBuying(false);
    }
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: product!.name, text: product!.tagline, url }); } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }

  return (
    <div className="pb-28 lg:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-mint">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-mint">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-card">
              {product.badge && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-mint px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint-foreground">{product.badge}</span>
              )}
              <img src={images[activeImg]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 bg-card transition ${activeImg === i ? "border-mint" : "border-border hover:border-mint/40"}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">{product.collection.toUpperCase()}</p>
            <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-3">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.tagline}</p>

            <div className="flex items-end gap-3 mb-8">
              {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
              <span className="text-3xl font-semibold text-mint">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="mb-1 rounded-full bg-mint/15 px-2 py-0.5 text-xs font-semibold text-mint">
                  Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              )}
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

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center hover:text-mint" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center hover:text-mint" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={() => add(product, qty)} className="flex-1 rounded-full border-2 border-mint py-3 font-display tracking-widest text-mint hover:bg-mint hover:text-mint-foreground transition">ADD TO CART</button>
            </div>

            <div className="mb-6 flex gap-3">
              <button
                onClick={buyNow}
                disabled={buying}
                className="flex-1 rounded-full bg-mint py-4 font-display tracking-widest text-mint-foreground hover:opacity-90 disabled:opacity-50 transition"
              >
                {buying ? "REDIRECTING…" : "BUY IT NOW"}
              </button>
              <button
                onClick={() => toggle(product.slug)}
                aria-label="Save to wishlist"
                className="grid h-14 w-14 place-items-center rounded-full border border-border hover:border-mint"
              >
                <Heart className={`h-5 w-5 ${wished ? "fill-mint text-mint" : ""}`} />
              </button>
              <button onClick={share} aria-label="Share" className="grid h-14 w-14 place-items-center rounded-full border border-border hover:border-mint">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
              {[{ icon: ShieldCheck, t: "12-Mo Warranty" }, { icon: Truck, t: "Free Shipping" }, { icon: Zap, t: "GaN III" }].map((b, i) => (
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-12">
          <h2 className="font-display text-3xl tracking-wide mb-8">RECENTLY VIEWED</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recentlyViewed.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}

      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed bottom-[64px] left-0 right-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="text-base font-semibold text-mint">{formatPrice(product.price * qty)}</span>
          </div>
          <button onClick={() => add(product, qty)} className="flex-1 rounded-full border border-mint py-3 text-xs font-display tracking-widest text-mint">
            ADD TO CART
          </button>
          <button onClick={buyNow} disabled={buying} className="flex-1 rounded-full bg-mint py-3 text-xs font-display tracking-widest text-mint-foreground disabled:opacity-50">
            {buying ? "…" : "BUY NOW"}
          </button>
        </div>
      </div>
    </div>
  );
}
