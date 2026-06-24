import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/content")({
  component: () => (
    <div className="rounded-xl border border-border bg-card p-8">
      <h2 className="font-display text-2xl tracking-wide">SITE CONTENT</h2>
      <p className="mt-2 text-muted-foreground">
        Edit hero slides, reviews, and the announcement bar. Reads/writes <code>GET/PATCH /admin/site-content</code>.
        Hook up once your API exposes the endpoint — JSON shape is in <code>MYSQL_SCHEMA.md</code>.
      </p>
    </div>
  ),
});
