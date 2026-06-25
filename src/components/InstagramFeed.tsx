import { Instagram } from "lucide-react";

// Curated Unsplash images — tech/lifestyle vibe matching the brand
const tiles = [
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&h=400&fit=crop",
];

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <div className="mb-8 text-center">
        <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">@VOLTDOT</p>
        <h2 className="font-display text-3xl md:text-4xl tracking-wide">FOLLOW THE FEED</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {tiles.map((src, i) => (
          <a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg bg-card"
          >
            <img src={src} alt="VoltDot Instagram" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/50">
              <Instagram className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
