import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Premium GaN chargers and accessories engineered for everyday performance. Backed by a 12-month warranty.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((I, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-mint hover:text-mint transition"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-sm mb-4">SHOP</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link to="/collections/$slug" params={{ slug: "chargers" }} className="hover:text-mint">Chargers</Link></li>
              <li><Link to="/collections/$slug" params={{ slug: "cables" }} className="hover:text-mint">Cables</Link></li>
              <li><Link to="/collections/$slug" params={{ slug: "powerbanks" }} className="hover:text-mint">Power Banks</Link></li>
              <li><Link to="/collections/$slug" params={{ slug: "car" }} className="hover:text-mint">Car Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-sm mb-4">COMPANY</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-mint">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-mint">Contact</Link></li>
              <li><a href="#" className="hover:text-mint">Warranty</a></li>
              <li><a href="#" className="hover:text-mint">Shipping</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-sm mb-4">STAY CHARGED</h4>
            <p className="text-sm text-muted-foreground mb-4">Get launches and offers in your inbox.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-mint focus:outline-none"
                />
              </div>
              <button className="rounded-full bg-mint px-4 text-sm font-medium text-mint-foreground hover:opacity-90">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} VoltDot. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-mint">Privacy</a>
            <a href="#" className="hover:text-mint">Terms</a>
            <a href="#" className="hover:text-mint">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
