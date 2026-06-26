import { useMemo, useState } from "react";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/products";

type Sort = "featured" | "price-asc" | "price-desc" | "name-asc";

export function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("featured");
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const prices = products.map((p) => p.price);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 10000;
  const [maxPrice, setMaxPrice] = useState<number>(max);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (onSaleOnly) list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "name-asc": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, sort, onSaleOnly, maxPrice]);


  return (
    <>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-mint" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onSaleOnly} onChange={(e) => setOnSaleOnly(e.target.checked)} className="accent-mint" />
            On sale
          </label>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="max-price" className="text-muted-foreground">Max Rs.{maxPrice.toLocaleString()}</label>
            <input
              id="max-price"
              type="range"
              min={min}
              max={max}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum price filter"
              className="w-32 accent-mint"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-mint" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-mint"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{filtered.length} of {products.length} products</p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          No products match your filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      )}
    </>
  );
}
