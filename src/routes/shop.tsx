import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — VoltDot" },
      { name: "description", content: "Browse all VoltDot chargers, cables, power banks and accessories." },
      { property: "og:title", content: "Shop — VoltDot" },
      { property: "og:description", content: "Browse all VoltDot products in one place." },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="mb-12">
        <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">EVERYTHING</p>
        <h1 className="font-display text-5xl md:text-7xl tracking-wide">SHOP</h1>
        <p className="mt-3 text-muted-foreground">{products.length} products</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
