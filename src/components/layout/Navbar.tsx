import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, LayoutGroup } from "framer-motion";
import { Menu, ArrowUpRight, MessageCircle, Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useSanity } from "@/integrations/sanity/useSanity";
import { siteSettingsQuery } from "@/integrations/sanity/queries";
import { whatsappUrl, CONTACT_EMAIL } from "@/lib/site";
import { glassPointer } from "@/lib/liquid-glass";
import { Modal } from "./Modal";

const NAV = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/tools/storyboard-generator", label: "AI Tool" },
  { to: "/about", label: "About Us" },
  { to: "/blog", label: "Blog" },
] as const;

export function Navbar() {
  const settings = useSanity<{ whatsappNumber?: string; email?: string }>(
    ["sanity", "settings"],
    siteSettingsQuery,
    {},
  );
  const wa = whatsappUrl(settings.whatsappNumber);
  const email = settings.email || CONTACT_EMAIL;
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
          <div
            {...glassPointer}
            className="liquid-glass glass-nav relative flex h-14 items-center gap-2 rounded-3xl py-1.5 pl-3 pr-2 sm:pl-4 xl:pr-4"
          >
            <div className="relative shrink-0">
              <Logo />
            </div>
            <LayoutGroup id="desktop-navbar">
              <nav
                aria-label="Main navigation"
                className="relative ml-6 hidden items-center gap-1 xl:flex"
              >
                {NAV.map((item) => {
                  const active = pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "relative px-4 py-3 text-sm font-medium text-[#111]"
                          : "nav-link-hover relative px-4 py-3 text-sm font-medium text-[#555] transition-colors hover:text-[#0e447f]"
                      }
                    >
                      {active && (
                        <motion.span
                          layoutId="navbar-active-pill"
                          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
                          className="absolute inset-0 rounded-[36px]"
                          style={{
                            borderLeft: "4px solid #C23800",
                            background: "rgba(0,0,0,0.04)",
                            boxShadow:
                              "-4px 0 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </LayoutGroup>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              className="relative ml-2 grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-foreground xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/contact"
              {...glassPointer}
              className="liquid-glass glass-amber relative inline-flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold sm:h-14 sm:px-6"
            >
              Start a project <ArrowUpRight className="hidden h-4 w-4 sm:block" />
            </Link>
            <a
              href={wa || `mailto:${email}`}
              target={wa ? "_blank" : undefined}
              rel={wa ? "noopener noreferrer" : undefined}
              aria-label={wa ? "Contact us on WhatsApp" : "Email ContentMesh"}
              {...glassPointer}
              className="liquid-glass glass-blue relative hidden h-14 items-center gap-2 rounded-full px-5 text-sm font-bold sm:inline-flex"
            >
              {wa ? <MessageCircle className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
              {wa ? "WhatsApp" : "Email us"}
            </a>
          </div>
        </div>
      </header>
      <Modal open={open} onClose={() => setOpen(false)} title="Explore ContentMesh">
        <nav aria-label="Mobile navigation" className="grid gap-2 p-6">
          {[{ to: "/", label: "Home" }, ...NAV, { to: "/contact", label: "Start a project" }].map(
            (item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.to ? "page" : undefined}
                className="flex min-h-14 items-center justify-between rounded-2xl px-4 py-3 text-lg font-semibold hover:bg-secondary aria-[current=page]:border-l-4 aria-[current=page]:border-accent aria-[current=page]:bg-secondary"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-brand-blue" />
              </Link>
            ),
          )}
          <a
            href={wa || `mailto:${email}`}
            className="mt-4 rounded-2xl bg-brand-blue px-4 py-4 text-center font-semibold text-white"
          >
            {wa ? "Contact us on WhatsApp" : "Email the studio"}
          </a>
        </nav>
      </Modal>
    </>
  );
}
