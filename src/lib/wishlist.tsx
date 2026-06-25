import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
};

const WishCtx = createContext<Ctx | null>(null);
const KEY = "voltdot.wishlist.v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(slugs));
  }, [slugs]);

  const value = useMemo<Ctx>(
    () => ({
      slugs,
      count: slugs.length,
      has: (s) => slugs.includes(s),
      toggle: (s) =>
        setSlugs((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s])),
      remove: (s) => setSlugs((c) => c.filter((x) => x !== s)),
      clear: () => setSlugs([]),
    }),
    [slugs],
  );

  return <WishCtx.Provider value={value}>{children}</WishCtx.Provider>;
}

export function useWishlist() {
  const c = useContext(WishCtx);
  if (!c) throw new Error("useWishlist must be inside WishlistProvider");
  return c;
}
