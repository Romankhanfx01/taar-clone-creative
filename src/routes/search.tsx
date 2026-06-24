import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/products.functions";

const schema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: ({ match }) => {
    const q = (match.search as { q?: string }).q ?? "";
    const title = q ? `Search: ${q} — VoltDot` : "Search — VoltDot";
    return {
      meta: [
        { title },
        { name: "description", content: "Search VoltDot chargers, cables, power banks and accessories." },
        { property: "og:title", content: title },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [term, setTerm] = useState(q);
  const search = useServerFn(listProducts);

  useEffect(() => setTerm(q), [q]);

  // Debounce -> URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (term !== q) navigate({ search: { q: term }, replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [term, q, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => search({ data: { search: q } }),
    enabled: q.length > 0,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">FIND IT FAST</p>
      <h1 className="font-display text-5xl md:text-6xl tracking-wide mb-8">SEARCH</h1>
      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          autoFocus
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search chargers, cables, power banks…"
          className="w-full rounded-full border border-border bg-card py-4 pl-12 pr-4 text-base outline-none focus:border-mint"
        />
      </div>

      <div className="mt-10">
        {q.length === 0 && (
          <p className="text-muted-foreground">Type to search the store.</p>
        )}
        {q.length > 0 && isLoading && <p className="text-muted-foreground">Searching…</p>}
        {q.length > 0 && !isLoading && data && data.length === 0 && (
          <p className="text-muted-foreground">No results for "{q}".</p>
        )}
        {data && data.length > 0 && (
          <>
            <p className="mb-6 text-sm text-muted-foreground">{data.length} result{data.length === 1 ? "" : "s"}</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
