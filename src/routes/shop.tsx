import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ProductGrid } from "@/components/ProductGrid";
import { listProducts } from "@/lib/products.functions";

const qo = queryOptions({ queryKey: ["products"], queryFn: () => listProducts({ data: {} }) });

export const Route = createFileRoute("/shop")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  head: () => ({
    meta: [
      { title: "Shop All — VoltDot" },
      { name: "description", content: "Browse every VoltDot product: GaN chargers, braided cables, power banks and car accessories." },
      { property: "og:title", content: "Shop All — VoltDot" },
      { property: "og:description", content: "Browse every VoltDot product in one place." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { data: products } = useSuspenseQuery(qo);
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="mb-10">
        <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">EVERYTHING</p>
        <h1 className="font-display text-5xl md:text-7xl tracking-wide">SHOP</h1>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
