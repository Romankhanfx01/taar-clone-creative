import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { api, ApiNotConfigured } from "./api.server";
import {
  seedProducts,
  seedCollections,
  type Product,
  type Collection,
} from "./products";

function normalize(p: any): Product {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? "",
    price: Number(p.price ?? 0),
    oldPrice: p.old_price != null ? Number(p.old_price) : p.oldPrice,
    image: p.image ?? "",
    collection: p.collection ?? p.collection_slug ?? "",
    badge: p.badge ?? undefined,
    description: p.description ?? "",
    specs: Array.isArray(p.specs) ? p.specs : Array.isArray(p.specs_json) ? p.specs_json : [],
  };
}

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { collection?: string; search?: string } | undefined) => d ?? {})
  .handler(async ({ data }) => {
    try {
      const res = await api<{ items: any[] }>("/products", { query: data });
      return res.items.map(normalize);
    } catch (e) {
      if (!(e instanceof ApiNotConfigured)) console.error("listProducts fallback:", e);
      let items = seedProducts;
      if (data.collection) items = items.filter((p) => p.collection === data.collection);
      if (data.search) {
        const q = data.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        );
      }
      return items;
    }
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const p = await api<any>(`/products/${encodeURIComponent(data.slug)}`);
      return normalize(p);
    } catch (e) {
      if (!(e instanceof ApiNotConfigured)) console.error("getProduct fallback:", e);
      return seedProducts.find((p) => p.slug === data.slug) ?? null;
    }
  });

export const listCollections = createServerFn({ method: "GET" }).handler(
  async (): Promise<Collection[]> => {
    try {
      const items = await api<any[]>("/collections");
      return items.map((c) => ({ slug: c.slug, name: c.name, count: Number(c.count ?? 0) }));
    } catch (e) {
      if (!(e instanceof ApiNotConfigured)) console.error("listCollections fallback:", e);
      return seedCollections;
    }
  },
);

export const getCollection = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      const res = await api<{ collection: any; items: any[] }>(`/collections/${data.slug}`);
      return {
        collection: { slug: res.collection.slug, name: res.collection.name, count: res.items.length },
        items: res.items.map(normalize),
      };
    } catch (e) {
      if (!(e instanceof ApiNotConfigured)) console.error("getCollection fallback:", e);
      const collection = seedCollections.find((c) => c.slug === data.slug);
      if (!collection) return null;
      const items = seedProducts.filter((p) => p.collection === data.slug);
      return { collection, items };
    }
  });

export const sitemapData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const res = await api<{ products: { slug: string }[]; collections: { slug: string }[] }>(
      "/sitemap-data",
    );
    return res;
  } catch {
    return {
      products: seedProducts.map((p) => ({ slug: p.slug })),
      collections: seedCollections.map((c) => ({ slug: c.slug })),
    };
  }
});
