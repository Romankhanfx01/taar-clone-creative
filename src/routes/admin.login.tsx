import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { loginAdmin } from "@/lib/admin-auth.functions";

export const Route = createFileRoute("/admin/login")({
  component: Login,
});

function Login() {
  const login = useServerFn(loginAdmin);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiBase = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <p className="dotted-text font-display text-xs tracking-[0.3em] mb-2">ADMIN</p>
      <h1 className="font-display text-4xl tracking-wide mb-8">SIGN IN</h1>

      <a
        href={`/admin/auth/google/start`}
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card py-3 hover:border-mint"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path fill="#FFC107" d="M21.8 10.2H12v3.8h5.6c-.5 2.5-2.7 4.2-5.6 4.2-3.4 0-6.2-2.8-6.2-6.2S8.6 5.8 12 5.8c1.5 0 2.9.5 4 1.5l2.7-2.7C16.9 2.9 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4 9.6-9.7 0-.7-.1-1.4-.2-2.1z"/>
        </svg>
        Continue with Google
      </a>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setLoading(true);
          try {
            await login({ data: { email, password } });
            navigate({ to: "/admin" });
          } catch (e: any) {
            setErr(e?.message ?? "Login failed");
          } finally {
            setLoading(false);
          }
        }}
        className="flex flex-col gap-4"
      >
        <label className="text-sm">
          <span className="mb-1 block text-muted-foreground">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:border-mint"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted-foreground">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none focus:border-mint"
          />
        </label>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button
          disabled={loading}
          className="rounded-full bg-mint py-3 font-display tracking-widest text-mint-foreground disabled:opacity-50"
        >
          {loading ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Admin auth is handled by your MySQL API at <code>{apiBase || "(your API)"}</code>.
      </p>
    </div>
  );
}
