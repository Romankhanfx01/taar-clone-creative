import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero-chargers.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — VoltDot" },
      { name: "description", content: "VoltDot is a local brand engineering certified GaN chargers and accessories for everyday use." },
      { property: "og:title", content: "About — VoltDot" },
      { property: "og:description", content: "Our story, mission and what makes VoltDot different." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 lg:px-12">
          <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">OUR STORY</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide">ABOUT VOLTDOT</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 lg:px-12">
        <h2 className="font-display text-3xl md:text-4xl mb-6">Built for everyday performance.</h2>
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            VoltDot is a homegrown brand obsessed with one question: why should fast, reliable charging cost a fortune
            or come from far-away factories no one's heard of?
          </p>
          <p>
            We design certified GaN chargers, braided cables, power banks and car accessories that pair premium materials
            with sensible pricing. Every product is independently tested and backed by a 12-month warranty.
          </p>
          <p>
            From a 30W pocket brick to a 65W triple-port that powers your MacBook, iPad and phone at once, we make
            charging gear you can actually trust — and depend on every day.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            { n: "50K+", l: "Happy Customers" },
            { n: "100%", l: "Certified Hardware" },
            { n: "12 Mo", l: "Warranty on Everything" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-8 text-center">
              <div className="font-display text-5xl text-mint mb-2">{s.n}</div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
