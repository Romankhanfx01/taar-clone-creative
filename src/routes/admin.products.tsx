import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  adminListProducts,
  adminSaveProduct,
  adminDeleteProduct,
} from "@/lib/admin-auth.functions";

type Row = {
  id?: number;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  price: number;
  old_price?: number | null;
  image?: string;
  badge?: string | null;
  collection?: string | null;
  published?: boolean;
};

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

function AdminProducts() {
  const list = useServerFn(adminListProducts);
  const save = useServerFn(adminSaveProduct);
  const remove = useServerFn(adminDeleteProduct);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });
  const [editing, setEditing] = useState<Row | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl tracking-wide">PRODUCTS</h2>
        <button
          onClick={() => setEditing({ slug: "", name: "", price: 0, published: true })}
          className="flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-medium text-mint-foreground"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {error && (
        <p className="text-sm text-destructive">
          {(error as Error).message || "Failed to load products"}
        </p>
      )}

      {data && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="py-2">Name</th><th>Slug</th><th>Price</th><th>Collection</th><th></th></tr>
            </thead>
            <tbody>
              {(data as Row[]).map((p) => (
                <tr key={p.id ?? p.slug} className="border-b border-border/60">
                  <td className="py-3">{p.name}</td>
                  <td className="text-muted-foreground">{p.slug}</td>
                  <td>Rs. {p.price}</td>
                  <td className="text-muted-foreground">{p.collection ?? "—"}</td>
                  <td className="text-right">
                    <button onClick={() => setEditing(p)} className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded hover:bg-background"><Pencil className="h-4 w-4" /></button>
                    <button
                      onClick={async () => {
                        if (!p.id || !confirm(`Delete ${p.name}?`)) return;
                        await remove({ data: { id: p.id } });
                        qc.invalidateQueries({ queryKey: ["admin-products"] });
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-background"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
              {(data as Row[]).length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl tracking-wide">{editing.id ? "EDIT PRODUCT" : "NEW PRODUCT"}</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await save({ data: {
                  id: editing.id,
                  slug: editing.slug,
                  name: editing.name,
                  tagline: editing.tagline ?? "",
                  description: editing.description ?? "",
                  price: Number(editing.price),
                  old_price: editing.old_price ? Number(editing.old_price) : null,
                  image: editing.image ?? "",
                  badge: editing.badge ?? null,
                  collection: editing.collection ?? null,
                  published: editing.published ?? true,
                } });
                setEditing(null);
                qc.invalidateQueries({ queryKey: ["admin-products"] });
              }}
              className="flex flex-col gap-3 text-sm"
            >
              {([
                ["name", "Name"],
                ["slug", "Slug"],
                ["tagline", "Tagline"],
                ["image", "Image URL"],
                ["collection", "Collection slug"],
                ["badge", "Badge"],
              ] as const).map(([k, label]) => (
                <label key={k}>
                  <span className="mb-1 block text-muted-foreground">{label}</span>
                  <input
                    value={(editing as any)[k] ?? ""}
                    onChange={(e) => setEditing({ ...editing, [k]: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-mint"
                  />
                </label>
              ))}
              <label>
                <span className="mb-1 block text-muted-foreground">Description</span>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-mint"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1 block text-muted-foreground">Price (PKR)</span>
                  <input type="number" required value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-mint" />
                </label>
                <label>
                  <span className="mb-1 block text-muted-foreground">Old price</span>
                  <input type="number" value={editing.old_price ?? ""}
                    onChange={(e) => setEditing({ ...editing, old_price: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-mint" />
                </label>
              </div>
              <button className="mt-3 rounded-full bg-mint py-3 font-display tracking-widest text-mint-foreground">SAVE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
