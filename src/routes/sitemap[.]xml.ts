import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { sitemapData } from "@/lib/products.functions";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const host = getRequestHost();
        const base = host ? `https://${host}` : "";
        const data = await sitemapData();

        const staticPaths = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/shop", changefreq: "weekly", priority: "0.9" },
          { path: "/collections", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.5" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
        ];
        const entries = [
          ...staticPaths,
          ...data.collections.map((c) => ({ path: `/collections/${c.slug}`, changefreq: "weekly", priority: "0.7" })),
          ...data.products.map((p) => ({ path: `/products/${p.slug}`, changefreq: "weekly", priority: "0.7" })),
        ];

        const urls = entries.map(
          (e) =>
            `  <url>\n    <loc>${base}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
