import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Mail, Phone, MapPin, Clock, Check } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { contactQuery } from "@/integrations/sanity/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ContentMesh | Book an AI Video Production Project" },
      {
        name: "description",
        content:
          "Get in touch with our AI video production agency. Book a discovery call, request a custom quote, or place an order for AI video creation services.",
      },
      {
        name: "keywords",
        content:
          "contact ai video production agency, book ai video project, request ai video quote, hire ai video company",
      },
      {
        property: "og:title",
        content: "Contact ContentMesh | Book an AI Video Production Project",
      },
      {
        property: "og:description",
        content:
          "Book a discovery call or place an order with ContentMesh AI Video Production Studio.",
      },
      { property: "og:url", content: "https://contentmesh.ai/contact" },
    ],
    links: [{ rel: "canonical", href: "https://contentmesh.ai/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().min(1, "Pick a service"),
  budget: z.string().min(1, "Pick a budget"),
  details: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
  mapEmbedUrl?: string;
};

const CONTACT_FALLBACK: ContactInfo = {
  email: "hello@contentmesh.studio",
  phone: "+1 (415) 555-0123",
  address: "88 Market Street, Suite 400, San Francisco, CA",
  hours: "Mon–Fri, 9am–6pm PT",
};

function Contact() {
  const info = useSanity<ContactInfo>(["sanity", "contact"], contactQuery, CONTACT_FALLBACK);
  const c = { ...CONTACT_FALLBACK, ...info };
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fd.entries()),
          contactEmail: c.email,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setErrors({ _form: data.error ?? "Something went wrong. Please try again." });
        setStatus("error");
        return;
      }
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch {
      setErrors({ _form: "Network error — please check your connection and try again." });
      setStatus("error");
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's build something worth watching"
        desc="Tell us about your project. We reply within one business day."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-10"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Ava Morgan" error={errors.name} />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="ava@brand.com"
                error={errors.email}
              />
              <Field
                label="Company"
                name="company"
                placeholder="Brand Inc."
                error={errors.company}
              />
              <Select
                label="Service Needed"
                name="service"
                error={errors.service}
                options={[
                  "AI Video Production",
                  "AI Animation",
                  "Voiceovers",
                  "Video Editing",
                  "Motion Graphics",
                  "Full Production",
                ]}
              />
              <Select
                label="Budget"
                name="budget"
                error={errors.budget}
                options={["< $2k", "$2k – $5k", "$5k – $15k", "$15k – $50k", "$50k+"]}
              />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium">Project Details</label>
              <textarea
                name="details"
                rows={5}
                placeholder="What are you making, for whom, and by when?"
                className={`w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/40 ${errors.details ? "border-destructive" : "border-input"}`}
              />
              {errors.details && <p className="mt-1 text-xs text-destructive">{errors.details}</p>}
            </div>
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-ink transition-transform hover:scale-[1.02] disabled:opacity-70"
              >
                {status === "sending" ? "Sending…" : "Submit"}
              </button>
              {status === "ok" && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  <Check className="h-4 w-4" /> Thanks — we'll be in touch shortly.
                </span>
              )}
              {status === "error" && errors._form && (
                <span className="text-sm font-medium text-destructive">{errors._form}</span>
              )}
            </div>
          </motion.form>

          <div className="space-y-4">
            {c.email && (
              <InfoCard icon={<Mail className="h-4 w-4" />} title="Email" value={c.email} />
            )}
            {c.phone && (
              <InfoCard icon={<Phone className="h-4 w-4" />} title="Phone" value={c.phone} />
            )}
            {c.address && (
              <InfoCard icon={<MapPin className="h-4 w-4" />} title="Studio" value={c.address} />
            )}
            {c.hours && (
              <InfoCard icon={<Clock className="h-4 w-4" />} title="Hours" value={c.hours} />
            )}
            <div className="overflow-hidden rounded-3xl border border-border">
              {c.mapEmbedUrl ? (
                <iframe
                  title="Studio location"
                  src={c.mapEmbedUrl}
                  className="aspect-[4/3] w-full"
                  loading="lazy"
                />
              ) : (
                <div
                  className="relative aspect-[4/3]"
                  style={{ background: "linear-gradient(135deg,#0D4C92,#FF5A1F)" }}
                >
                  <div className="absolute inset-0 mesh-bg opacity-20" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="glass rounded-full px-4 py-2 text-xs font-semibold text-foreground">
                      Map preview
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/40 ${error ? "border-destructive" : "border-input"}`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <select
        name={name}
        defaultValue=""
        className={`w-full rounded-2xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/40 ${error ? "border-destructive" : "border-input"}`}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-white">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        <p className="mt-0.5 font-medium">{value}</p>
      </div>
    </div>
  );
}
