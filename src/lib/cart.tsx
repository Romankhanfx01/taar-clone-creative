import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

type CartItem = { product: Product; qty: number };
type CartCtx = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "voltdot.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.product.price, 0);
    return {
      items,
      open,
      setOpen,
      count,
      subtotal,
      add: (p, qty = 1) => {
        setItems((curr) => {
          const found = curr.find((i) => i.product.slug === p.slug);
          if (found) return curr.map((i) => (i.product.slug === p.slug ? { ...i, qty: i.qty + qty } : i));
          return [...curr, { product: p, qty }];
        });
        setOpen(true);
      },
      remove: (slug) => setItems((c) => c.filter((i) => i.product.slug !== slug)),
      setQty: (slug, qty) =>
        setItems((c) => c.map((i) => (i.product.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
