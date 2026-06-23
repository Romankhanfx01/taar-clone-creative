import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { collections, products } from "@/lib/products";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = collections.find((c) => c.slug === params.slug);
    if (!collection) throw notFound();
    return { collection };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.collection.name ?? "Collection"} — VoltDot` },
      { name: "description", content: `Shop the ${loaderData?.collection.name ?? ""} collection at VoltDot.` },
      { property: "og:title", content: `${loaderData?.collection.name ?? "Collection"} — VoltDot` },
      { property: "og:description", content: `Shop the ${loaderData?.collection.name ?? ""} collection at VoltDot.` },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Collection not found</h1>
      <p className="text-muted-foreground">That collection doesn't exist.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: CollectionPage,
});

function CollectionPage() {
  const { collection } = Route.useLoaderData();
  const items = products.filter((p) => p.collection === collection.slug);
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">COLLECTION</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-3">{collection.name.toUpperCase()}</h1>
      <p className="text-muted-foreground mb-12">{items.length} products</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
