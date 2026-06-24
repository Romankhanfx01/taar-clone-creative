import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCard } from "@/components/ProductCard";
import { Marquee } from "@/components/Marquee";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Reviews } from "@/components/Reviews";
import { listProducts, listCollections } from "@/lib/products.functions";
import bannerCharger from "@/assets/banner-charger.jpg";
import bannerCable from "@/assets/banner-cable.jpg";

const productsQO = queryOptions({ queryKey: ["products"], queryFn: () => listProducts({ data: {} }) });
const collectionsQO = queryOptions({ queryKey: ["collections"], queryFn: () => listCollections() });

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQO),
      context.queryClient.ensureQueryData(collectionsQO),
    ]);
  },
  head: () => ({
    meta: [
      { title: "VoltDot — Pakistan's Certified GaN Charger Brand" },
      { name: "description", content: "Shop GaN chargers, braided cables, power banks and car accessories. Certified, warrantied and built for daily use." },
      { property: "og:title", content: "VoltDot — Pakistan's Certified GaN Charger Brand" },
      { property: "og:description", content: "Certified chargers and accessories engineered for everyday performance." },
      { property: "og:type", content: "website" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "VoltDot",
        url: "/",
        description: "Certified GaN chargers, cables, power banks and car accessories.",
      }),
    }],
  }),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQO);
  const { data: collections } = useSuspenseQuery(collectionsQO);
  const featured = products.slice(0, 3);
  const rest = products.slice(3);

  return (
    <div>
      <HeroSlider />
      <Marquee items={["FREE SHIPPING OVER RS. 5,000","12-MONTH WARRANTY","GaN III TECHNOLOGY","7-DAY RETURNS","MADE FOR EVERYDAY"]} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">THE DOT SERIES</p>
            <h2 className="font-display text-4xl md:text-6xl tracking-wide">FEATURED CHARGERS</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">Compact GaN bricks for every device — from earbuds to MacBooks.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl grid gap-6 px-6 lg:px-12 md:grid-cols-2">
        {[
          { img: bannerCharger, eyebrow: "FAST CHARGE", title: "65W IN YOUR POCKET", to: "dot-gan-65w" },
          { img: bannerCable, eyebrow: "BUILT TO LAST", title: "BRAIDED & CERTIFIED", to: "thread-usb-c-cable" },
        ].map((b, i) => (
          <Link key={i} to="/products/$slug" params={{ slug: b.to }} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <img src={b.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="dotted-text font-display text-xs tracking-[0.3em] mb-2">{b.eyebrow}</p>
              <h3 className="font-display text-3xl md:text-4xl tracking-wide">{b.title}</h3>
              <span className="mt-4 inline-block text-mint group-hover:translate-x-1 transition">Shop now →</span>
            </div>
          </Link>
        ))}
      </section>

      <FeatureGrid />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">BROWSE</p>
              <h2 className="font-display text-4xl md:text-5xl tracking-wide">COLLECTIONS</h2>
            </div>
            <Link to="/collections" className="hidden md:inline text-mint hover:underline underline-offset-4">View all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c) => (
              <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }} className="group flex flex-col rounded-xl border border-border bg-card p-8 transition hover:border-mint/40 hover:shadow-[var(--shadow-card)]">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.count} products</span>
                <span className="mt-2 font-display text-2xl tracking-wide group-hover:text-mint transition">{c.name}</span>
                <span className="mt-6 text-sm text-mint">Shop →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {rest.length > 0 && (
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-10 text-center">
              <h2 className="font-display text-4xl md:text-5xl tracking-wide">SHOP THE STORE</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <Reviews />
    </div>
  );
}
