import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";

const messages = [
  { icon: Truck, text: "Free shipping on orders over Rs. 5,000" },
  { icon: Truck, text: "Up to 12 months warranty on every product" },
  { icon: Truck, text: "Easy 7-day returns — no questions asked" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);
  const M = messages[i].icon;
  return (
    <div className="bg-secondary/60 border-b border-border text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <button
          aria-label="Previous"
          onClick={() => setI((v) => (v - 1 + messages.length) % messages.length)}
          className="text-muted-foreground hover:text-mint transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-muted-foreground">
          <M className="h-3.5 w-3.5 text-mint" />
          <span className="tracking-wide">{messages[i].text}</span>
        </div>
        <button
          aria-label="Next"
          onClick={() => setI((v) => (v + 1) % messages.length)}
          className="text-muted-foreground hover:text-mint transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
