import { seoHead } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { contactSchema as schema, CONTACT_SERVICES, CONTACT_BUDGETS } from "@/lib/contact-schema";
import { CONTACT_EMAIL } from "@/lib/site";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Mail, Phone, MapPin, Clock, Check } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { contactQuery } from "@/integrations/sanity/queries";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { reference?: string } =>
    typeof search.reference === "string" && search.reference.trim()
      ? { reference: search.reference.trim().slice(0, 160) }
      : {},
  head: () =>
    seoHead(
      "Request an AI Video Quote | ContentMesh Studios",
      "Tell us about your video project, audience and deadline. Request a custom quote for AI commercials, animation, voiceovers and content production.",
      "/contact",
    ),
  component: Contact,
});

type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
  mapEmbedUrl?: string;
};

const CONTACT_FALLBACK: ContactInfo = { email: CONTACT_EMAIL };

function Contact() {
  const { reference } = Route.useSearch();
  const info = useSanity<ContactInfo>(["sanity", "contact"], contactQuery, CONTACT_FALLBACK);
  const c = { ...CONTACT_FALLBACK, ...info };
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setErrors({});
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      (
        form.elements.namedItem(parsed.error.issues[0]?.path[0] as string) as HTMLElement | null
      )?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        signal: AbortSignal.timeout(20_000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fd.entries()),
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setErrors({ _form: data.error ?? "Something went wrong. Please try again." });
        setStatus("error");
        return;
      }
      setStatus("ok");
      form.reset();
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
        desc="A first idea is enough. Tell us what you have in mind and we’ll work through the scope together."
      />

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <motion.form
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            noValidate
            aria-busy={status === "sending"}
            onSubmit={onSubmit}
            className="rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-10"
          >
            <p className="eyebrow">Your project brief</p>
            <h2 className="mt-3 font-display text-2xl font-bold">
              A few details. A better starting point.
            </h2>
            <p className="mt-3 mb-8 text-sm text-muted-foreground">
              Fields marked * are required. An estimate request carries no commitment.
            </p>
            {reference && (
              <p className="mb-6 rounded-xl bg-brand-blue/5 px-4 py-3 text-sm text-brand-blue">
                Project reference: <strong>{reference}</strong>
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Your name" error={errors.name} />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                error={errors.email}
              />
              <Field
                label="Company"
                name="company"
                placeholder="Brand Inc."
                error={errors.company}
              />
              <Select
                label="Service needed"
                name="service"
                error={errors.service}
                options={CONTACT_SERVICES}
              />
              <Select
                label="Budget"
                name="budget"
                error={errors.budget}
                options={CONTACT_BUDGETS}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
                Project details *
              </label>
              <textarea
                id="details"
                name="details"
                key={reference || "new-brief"}
                defaultValue={
                  reference
                    ? `I’m interested in a project inspired by: ${reference}.\n\nMy audience, idea and deadline: `
                    : ""
                }
                required
                minLength={10}
                maxLength={2000}
                aria-invalid={!!errors.details}
                aria-describedby={errors.details ? "details-error" : "details-hint"}
                rows={5}
                placeholder="What are you making, for whom, and by when?"
                className={`w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/40 ${errors.details ? "border-destructive" : "border-input"}`}
              />
              <p id="details-hint" className="mt-2 text-xs text-muted-foreground">
                Include the audience, approximate length, visual style and deadline. Up to 2,000
                characters.
              </p>
              {errors.details && (
                <p id="details-error" className="mt-1 text-sm text-destructive">
                  {errors.details}
                </p>
              )}
            </div>
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />

            <div className="mt-6 flex flex-wrap items-center gap-4" aria-live="polite">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-ink transition-transform hover:scale-[1.02] disabled:opacity-70"
              >
                {status === "sending" ? "Sending your brief…" : "Send project brief"}
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
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              By sending your brief, you agree to be contacted about this enquiry. Read our{" "}
              <Link to="/privacy" className="underline underline-offset-4">
                privacy policy
              </Link>
              .
            </p>
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
            <div className="rounded-3xl bg-brand-blue p-7 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                What happens next
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold">
                From your brief to a clear plan.
              </h2>
              <ol className="mt-6 space-y-6">
                {[
                  "We review your goals, references and deadline.",
                  "We discuss the creative direction and any missing details.",
                  "You receive a proposed scope, timeline and quote.",
                ].map((step, i) => (
                  <li key={step} className="flex gap-4 text-sm leading-relaxed">
                    <span className="font-semibold text-white/60">0{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-white/20 pt-5 text-sm text-white/80">
                Prefer email?{" "}
                <a
                  className="font-semibold text-white underline underline-offset-4 break-all"
                  href={`mailto:${c.email}`}
                >
                  {c.email}
                </a>
              </p>
            </div>
            {c.mapEmbedUrl && /^https:\/\/(www\.)?google\.com\/maps\/embed/.test(c.mapEmbedUrl) && (
              <iframe
                title="Studio location"
                src={c.mapEmbedUrl}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-3xl border border-border"
              />
            )}
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
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
        {name === "company" ? " (optional)" : " *"}
      </label>
      <input
        id={name}
        name={name}
        required={name !== "company"}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        type={type}
        maxLength={name === "email" ? 200 : name === "name" ? 80 : 120}
        autoComplete={name === "company" ? "organization" : name}
        placeholder={placeholder}
        className={`w-full rounded-2xl border bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-accent/40 ${error ? "border-destructive" : "border-input"}`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
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
  options: readonly string[];
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
        {name === "company" ? " (optional)" : " *"}
      </label>
      <select
        id={name}
        name={name}
        required={name !== "company"}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
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
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-destructive">
          {error}
        </p>
      )}
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
        <p className="mt-0.5 break-words font-medium">
          {title === "Email" ? (
            <a href={`mailto:${value}`} className="hover:underline">
              {value}
            </a>
          ) : title === "Phone" ? (
            <a href={`tel:${value.replace(/[^+0-9]/g, "")}`} className="hover:underline">
              {value}
            </a>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );
}
