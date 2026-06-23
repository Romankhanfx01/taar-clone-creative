import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — VoltDot" },
      { name: "description", content: "Get in touch with the VoltDot team for support, wholesale or partnerships." },
      { property: "og:title", content: "Contact — VoltDot" },
      { property: "og:description", content: "Reach out — we'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
      <p className="dotted-text font-display text-sm tracking-[0.3em] mb-2">GET IN TOUCH</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-wide mb-3">CONTACT US</h1>
      <p className="max-w-xl text-muted-foreground mb-12">
        Questions, wholesale, partnerships or warranty claims — we usually reply within one business day.
      </p>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "hello@voltdot.example" },
            { icon: Phone, label: "Phone", value: "+92 300 0000000" },
            { icon: MessageCircle, label: "WhatsApp", value: "+92 300 0000000" },
            { icon: MapPin, label: "Office", value: "Lahore, Pakistan" },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-mint/10 text-mint">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <p className="mt-1 font-medium">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          {sent ? (
            <div className="grid h-full place-items-center text-center py-12">
              <div>
                <h3 className="font-display text-3xl text-mint mb-3">Thanks!</h3>
                <p className="text-muted-foreground">We'll be in touch shortly.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="Your name" type="text" required />
              <Field label="Email" type="email" required />
              <Field label="Subject" type="text" />
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea
                  required
                  rows={5}
                  className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm focus:border-mint focus:outline-none"
                />
              </div>
              <button className="w-full rounded-full bg-mint py-4 font-display tracking-widest text-mint-foreground hover:opacity-90 transition">
                SEND MESSAGE
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        {...rest}
        className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-mint focus:outline-none"
      />
    </div>
  );
}
