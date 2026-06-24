import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { LogOut, Package, ShoppingBag, Image as ImageIcon, Layers } from "lucide-react";
import { getAdminMe, logoutAdmin } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — VoltDot" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const me = useServerFn(getAdminMe);
  const logout = useServerFn(logoutAdmin);
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({ queryKey: ["admin-me"], queryFn: () => me() });

  useEffect(() => {
    if (!isLoading && data && !data.admin) {
      const path = window.location.pathname;
      if (!path.endsWith("/admin/login")) navigate({ to: "/admin/login" });
    }
  }, [data, isLoading, navigate]);

  if (isLoading) {
    return <div className="mx-auto max-w-md px-6 py-24 text-center text-muted-foreground">Loading…</div>;
  }

  if (data && !data.configured) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20">
        <h1 className="font-display text-3xl tracking-wide">Admin not configured</h1>
        <p className="mt-3 text-muted-foreground">
          The admin panel requires your MySQL API. Add <code>API_BASE_URL</code> and <code>API_ADMIN_TOKEN</code> in project secrets, then reload this page.
        </p>
        <p className="mt-3 text-muted-foreground text-sm">
          See <code>MYSQL_SCHEMA.md</code> for the schema and endpoint contract.
        </p>
      </div>
    );
  }

  if (!data?.admin) return <Outlet />; // login page

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="dotted-text font-display text-xs tracking-[0.3em]">ADMIN</p>
          <h1 className="font-display text-3xl tracking-wide">CONTROL PANEL</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{data.admin.email}</span>
          <button
            onClick={async () => { await logout(); refetch(); }}
            className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-mint"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto">
          {[
            { to: "/admin", label: "Dashboard", icon: Layers },
            { to: "/admin/products", label: "Products", icon: Package },
            { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
            { to: "/admin/content", label: "Site Content", icon: ImageIcon },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/admin" }}
              activeProps={{ className: "bg-mint/15 text-mint" }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-card whitespace-nowrap"
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
