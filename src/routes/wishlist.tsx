import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/products.functions";
import { useWishlist } from "@/lib/wishlist";

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
  const { slugs } = useWishlist();
  const items = all.filter((p) => slugs.includes(p.slug));

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">SAVED FOR LATER</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-10">WISHLIST</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-mint px-8 py-3 font-display tracking-widest text-mint-foreground">
            BROWSE PRODUCTS
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </div>
  );
}
