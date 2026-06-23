import { Link } from "@tanstack/react-router";
import { formatPrice, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Plus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-mint/40 hover:shadow-[var(--shadow-card)]">
      {product.badge && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-mint px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint-foreground">
          {product.badge}
        </span>
      )}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-background"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.tagline}</p>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="font-display text-xl tracking-wide hover:text-mint transition"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="text-lg font-semibold text-mint">{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={() => add(product)}
            aria-label={`Add ${product.name} to cart`}
            className="grid h-10 w-10 place-items-center rounded-full border border-mint bg-mint/10 text-mint hover:bg-mint hover:text-mint-foreground transition"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
