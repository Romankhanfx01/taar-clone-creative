import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ShoppingBag, Heart, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function MobileBottomNav() {
  const { count, setOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));
  const base = "flex flex-col items-center justify-center gap-1 min-h-11 py-2 text-[10px] font-medium tracking-wide";
  const active = "text-mint";
  const idle = "text-foreground/70";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
      aria-label="Bottom navigation"
    >
      <Link to="/" className={`${base} ${isActive("/") ? active : idle}`}>
        <Home className="h-5 w-5" />
        HOME
      </Link>
      <Link to="/shop" className={`${base} ${isActive("/shop") ? active : idle}`}>
        <ShoppingBag className="h-5 w-5" />
        SHOP
      </Link>
      <Link to="/wishlist" className={`${base} relative ${isActive("/wishlist") ? active : idle}`}>
        <Heart className="h-5 w-5" />
        {wishCount > 0 && (
          <span className="absolute right-4 top-1 grid h-4 w-4 place-items-center rounded-full bg-mint text-[9px] font-bold text-mint-foreground">
            {wishCount}
          </span>
        )}
        WISHLIST
      </Link>
      <button onClick={() => setOpen(true)} className={`${base} relative ${idle}`}>
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute right-3 top-1 grid h-4 w-4 place-items-center rounded-full bg-mint text-[9px] font-bold text-mint-foreground">
            {count}
          </span>
        )}
        CART
      </button>
      <Link to="/account" className={`${base} ${isActive("/account") ? active : idle}`}>
        <User className="h-5 w-5" />
        ACCOUNT
      </Link>
    </nav>
  );
}
