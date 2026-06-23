import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/hero-chargers.jpg";
import bannerCharger from "@/assets/banner-charger.jpg";
import bannerCable from "@/assets/banner-cable.jpg";

const slides = [
  {
    image: hero,
    eyebrow: "Pakistan's first local brand",
    title: "OFFERING CERTIFIED CHARGERS",
    headline: "DOT",
    sub: "GaN CHARGER SERIES",
    cta: { label: "Shop the series", to: "/shop" as const },
  },
  {
    image: bannerCharger,
    eyebrow: "New release",
    title: "POCKET-SIZED 65W POWER",
    headline: "PRO 65",
    sub: "Triple-port GaN III",
    cta: { label: "Buy now", to: "/products/$slug" as const, params: { slug: "dot-gan-65w" } },
  },
  {
    image: bannerCable,
    eyebrow: "Built to last",
    title: "BRAIDED 100W CABLES",
    headline: "THREAD",
    sub: "USB-C to USB-C",
    cta: { label: "Explore cables", to: "/collections/$slug" as const, params: { slug: "cables" } },
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-background">
      {slides.map((slide, idx) => (
        <img
          key={idx}
          src={slide.image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-12">
        <p className="dotted-text font-display text-sm md:text-base tracking-[0.3em] mb-3">
          {s.eyebrow.toUpperCase()}
        </p>
        <h2 className="text-mint font-display text-2xl md:text-4xl tracking-wider mb-6 text-glow">
          {s.title}
        </h2>
        <h1 className="font-display text-7xl md:text-[10rem] leading-none mb-2">{s.headline}</h1>
        <p className="font-display text-xl md:text-2xl tracking-[0.2em] text-muted-foreground mb-10">
          {s.sub}
        </p>
        <div>
          <Link
            to={s.cta.to as string}
            params={(s.cta as { params?: Record<string, string> }).params as never}
            className="inline-flex items-center justify-center rounded-full border-2 border-mint bg-mint/10 px-10 py-4 font-display text-lg tracking-widest text-mint hover:bg-mint hover:text-mint-foreground transition"
          >
            {s.cta.label.toUpperCase()}
          </Link>
        </div>
      </div>

      <button
        onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-border bg-background/40 backdrop-blur hover:border-mint hover:text-mint transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => setI((v) => (v + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-border bg-background/40 backdrop-blur hover:border-mint hover:text-mint transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-10 bg-mint" : "w-4 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
