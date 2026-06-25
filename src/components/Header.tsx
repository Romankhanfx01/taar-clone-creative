import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <button className="lg:hidden text-foreground" onClick={() => setMobile(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-mint" }}
              inactiveProps={{ className: "text-foreground/80 hover:text-mint" }}
              className="text-sm font-medium tracking-wide transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Search" onClick={() => navigate({ to: "/search", search: { q: "" } })} className="text-foreground/80 hover:text-mint transition">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/account" aria-label="Account" className="hidden sm:inline text-foreground/80 hover:text-mint transition">
            <User className="h-5 w-5" />
          </Link>
          <button
            aria-label="Cart"
            onClick={() => setOpen(true)}
            className="relative text-foreground/80 hover:text-mint transition"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-mint text-[10px] font-bold text-mint-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Logo />
            <button onClick={() => setMobile(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col p-6 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobile(false)}
                className="py-4 border-b border-border text-lg font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
