import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getCollection } from "@/lib/products.functions";

const qo = (slug: string) =>
  queryOptions({ queryKey: ["collection", slug], queryFn: () => getCollection({ data: { slug } }) });

export const Route = createFileRoute("/collections/$slug")({
  loader: async ({ params, context }) => {
    const res = await context.queryClient.ensureQueryData(qo(params.slug));
    if (!res) throw notFound();
    return { collection: res.collection };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.collection;
    if (!c) return {};
    return {
      meta: [
        { title: `${c.name} — VoltDot` },
        { name: "description", content: `Shop the ${c.name} collection at VoltDot.` },
        { property: "og:title", content: `${c.name} — VoltDot` },
        { property: "og:description", content: `Shop the ${c.name} collection at VoltDot.` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl mb-3">Collection not found</h1>
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
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(qo(slug));
  if (!data) return null;
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">COLLECTION</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-3">{data.collection.name.toUpperCase()}</h1>
      <p className="text-muted-foreground mb-12">{data.items.length} products</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}
