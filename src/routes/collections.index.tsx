import { createFileRoute, Link } from "@tanstack/react-router";
import { collections } from "@/lib/products";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — VoltDot" },
      { name: "description", content: "Browse VoltDot product collections: chargers, cables, power banks and car accessories." },
      { property: "og:title", content: "Collections — VoltDot" },
      { property: "og:description", content: "Shop curated VoltDot collections." },
    ],
  }),
  component: CollectionsIndex,
});

function CollectionsIndex() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">BROWSE</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-12">COLLECTIONS</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((c) => (
          <Link
            key={c.slug}
            to="/collections/$slug"
            params={{ slug: c.slug }}
            className="group flex flex-col rounded-xl border border-border bg-card p-8 transition hover:border-mint/40"
          >
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.count} products</span>
            <span className="mt-2 font-display text-2xl tracking-wide group-hover:text-mint transition">{c.name}</span>
            <span className="mt-6 text-sm text-mint">Shop →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
