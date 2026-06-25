import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User, Package, MapPin, LogIn } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — VoltDot" }, { name: "description", content: "Sign in to track orders and manage your VoltDot account." }] }),
  component: Page,
});

function Page() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-12">
      <div className="mb-12 text-center">
        <p className="dotted-text font-display text-sm tracking-[0.3em] mb-3">YOUR ACCOUNT</p>
        <h1 className="font-display text-5xl tracking-wide">WELCOME BACK</h1>
        <p className="mt-3 text-muted-foreground">Sign in to track orders, manage addresses and check warranty status.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-6 flex gap-2">
            <button onClick={() => setMode("signin")} className={`rounded-full px-4 py-1.5 text-sm tracking-widest ${mode === "signin" ? "bg-mint text-mint-foreground" : "text-muted-foreground"}`}>SIGN IN</button>
            <button onClick={() => setMode("register")} className={`rounded-full px-4 py-1.5 text-sm tracking-widest ${mode === "register" ? "bg-mint text-mint-foreground" : "text-muted-foreground"}`}>REGISTER</button>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === "register" && (
              <input type="text" placeholder="Full name" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-mint focus:outline-none" />
            )}
            <input type="email" placeholder="Email" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-mint focus:outline-none" />
            <input type="password" placeholder="Password" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-mint focus:outline-none" />
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-mint py-3 text-sm font-medium tracking-widest text-mint-foreground hover:opacity-90">
              <LogIn className="h-4 w-4" /> {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
            <p className="text-center text-xs text-muted-foreground">By continuing you agree to our <Link to="/policies/terms" className="text-mint">Terms</Link> and <Link to="/policies/privacy" className="text-mint">Privacy Policy</Link>.</p>
          </form>
        </div>

        <div className="space-y-4">
          {[
            { I: Package, t: "Track Orders", d: "See live shipping updates for every order in one place." },
            { I: MapPin, t: "Saved Addresses", d: "Speed through checkout with stored delivery details." },
            { I: User, t: "Warranty Locker", d: "Register devices and file claims in seconds." },
          ].map(({ I, t, d }) => (
            <div key={t} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mint/10 text-mint"><I className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display tracking-wide text-lg">{t}</h3>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
