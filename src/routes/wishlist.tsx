import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/products.functions";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

const qo = queryOptions({ queryKey: ["products"], queryFn: () => listProducts({ data: {} }) });

export const Route = createFileRoute("/wishlist")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  head: () => ({
    meta: [
      { title: "Wishlist — VoltDot" },
      { name: "description", content: "Your saved VoltDot products." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { data: all } = useSuspenseQuery(qo);
  const { slugs, clear } = useWishlist();
  const { add, setOpen } = useCart();
  const items = all.filter((p) => slugs.includes(p.slug));

  function addAllToCart() {
    items.forEach((p) => add(p, 1));
    setOpen(true);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">SAVED FOR LATER</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-10">WISHLIST</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 text-muted-foreground">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-mint px-8 py-3 font-display tracking-widest text-mint-foreground">
            BROWSE PRODUCTS
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{items.length} saved item{items.length === 1 ? "" : "s"}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={addAllToCart}
                className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2.5 text-xs font-display tracking-widest text-mint-foreground hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" /> ADD ALL TO CART
              </button>
              <button
                onClick={clear}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-display tracking-widest text-foreground/80 hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> CLEAR
              </button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </>
      )}
    </main>
  );
}

