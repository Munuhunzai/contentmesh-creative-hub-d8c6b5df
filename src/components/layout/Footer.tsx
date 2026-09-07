import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Facebook, Youtube, Send } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useSanity } from "@/integrations/sanity/useSanity";
import { siteSettingsQuery } from "@/integrations/sanity/queries";

type Settings = {
  tagline?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
};

const FALLBACK: Settings = {
  tagline:
    "An AI-powered creative studio helping brands ship cinematic content — faster, sharper, on-message.",
  socials: { instagram: "#", linkedin: "#", facebook: "#", youtube: "#" },
};

export function Footer() {
  const settings = useSanity<Settings>(
    ["sanity", "siteSettings", "footer"],
    siteSettingsQuery,
    FALLBACK,
  );
  const s = { ...FALLBACK, ...settings, socials: { ...FALLBACK.socials, ...settings.socials } };

  const socials: [React.ComponentType<{ className?: string }>, string, string][] = [
    [Instagram, "Instagram", s.socials?.instagram ?? "#"],
    [Linkedin, "LinkedIn", s.socials?.linkedin ?? "#"],
    [Facebook, "Facebook", s.socials?.facebook ?? s.socials?.twitter ?? "#"],
  ];

  if (s.socials?.youtube && s.socials.youtube !== "#") {
    socials.push([Youtube, "YouTube", s.socials.youtube]);
  }

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{s.tagline}</p>
            <div className="mt-6 flex gap-2">
              {socials
                .filter(([, , href]) => /^https?:\/\//.test(href))
                .map(([Icon, label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:bg-[#0D4C92] hover:border-[#0D4C92] hover:text-white shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
            </div>
          </div>

          <FooterCol
            title="Company"
            links={[
              ["About Us", "/about"],
              ["Portfolio Showcase", "/portfolio"],
              ["Creative Blog", "/blog"],
              ["Contact Us", "/contact"],
            ]}
          />
          <FooterCol
            title="Services"
            links={[
              ["AI Video Production", "/services"],
              ["AI Animation", "/services"],
              ["AI Voiceovers", "/services"],
              ["Motion Graphics", "/services"],
              ["Free Storyboard Tool", "/tools/storyboard-generator"],
            ]}
          />

          <div>
            <p className="eyebrow">Have a project in mind?</p>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
              Let's make it happen.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A clear brief is the start of a great film. Tell us your idea, audience and deadline.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex min-h-12 items-center gap-3 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white"
            >
              Start a conversation <Send className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ContentMesh Studio. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
