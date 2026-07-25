import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Menu, X, ArrowUpRight, Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useSanity } from "@/integrations/sanity/useSanity";
import { siteSettingsQuery } from "@/integrations/sanity/queries";

// ─── WhatsApp SVG icon ────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Nav links (no "Home" — logo serves as home) ─────────────────────────────
const NAV = [
  { to: "/portfolio",  label: "Portfolio"  },
  { to: "/services",   label: "Services"   },
  { to: "/about",      label: "About Us"   },
  { to: "/pricing",    label: "Pricing"    },
  { to: "/blog",       label: "Blog"       },
] as const;

type SiteSettings = { whatsappNumber?: string; email?: string };

export function Navbar() {
  const settings = useSanity<SiteSettings>(["sanity", "siteSettings"], siteSettingsQuery, {});
  const waNumber  = settings?.whatsappNumber ?? "923000000000";
  const waHref    = `https://wa.me/${waNumber}`;
  const siteEmail = settings?.email || "waheed.sul00@gmail.com";

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const router   = useRouter();
  const pathname = router.state.location.pathname;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ══════════════════════ HEADER ══════════════════════ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[100] flex justify-center px-6 py-5 sm:px-10 lg:px-12"
      >
        <div className="flex w-full max-w-[1720px] items-center justify-between gap-4">
          {/* ── White glass pill: logo + desktop nav ── */}
          <div
            className="flex h-[56px] items-center gap-1 rounded-[24px] px-4 py-1.5"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              boxShadow: scrolled
                ? "0 8px 32px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.9) inset"
                : "0 4px 20px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
              border: "1px solid rgba(255,255,255,0.75)",
              transition: "box-shadow 0.4s",
            }}
          >
            {/* Logo */}
            <Logo />

            {/* Desktop links — increased padding/margin from logo (ml-8 lg:ml-12) */}
            <LayoutGroup id="navbar-pills">
            <nav className="ml-8 hidden items-center gap-1.5 lg:flex lg:ml-12" aria-label="Main navigation">
              {NAV.map((n) => {
                const active = pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="relative px-5 py-2 text-sm font-medium transition-colors"
                    style={{ color: active ? "#111" : "#666" }}
                  >
                    {/* Single layoutId pill — Framer Motion slides it between whichever link is active */}
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0"
                        style={{
                          borderRadius: "36px",
                          borderLeft: "4px solid #FF5A1F",
                          background: "rgba(0,0,0,0.04)",
                          boxShadow: "-4px 0 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <span className="relative z-10">{n.label}</span>
                  </Link>
                );
              })}
            </nav>
            </LayoutGroup>

            {/* Mobile hamburger (inside pill) */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="ml-2 grid h-9 w-9 place-items-center rounded-xl transition-colors lg:hidden"
              style={{ background: "rgba(0,0,0,0.06)", color: "#333" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="absolute"
                  >
                    <X className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    className="absolute"
                  >
                    <Menu className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* ── Action Buttons Container: Place Order (Email/Form) + WhatsApp Contact (Matching 56px Height & close to merging) ── */}
          <div className="hidden items-center gap-1.5 sm:inline-flex">
            {/* Place Order Button */}
            <Link
              to="/contact"
              aria-label="Place an Order"
              className="inline-flex h-[56px] items-center gap-2 rounded-[20px] border border-white/80 bg-white/90 px-5 text-sm font-bold text-gray-900 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="h-4 w-4 text-[#FF5A1F]" />
              Place Order
            </Link>

            {/* WhatsApp Contact Us button */}
            <motion.a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-[56px] items-center gap-2.5 rounded-[20px] px-6 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #FF5A1F 0%, #FF7A00 100%)",
                boxShadow: "0 4px 24px rgba(255,90,31,0.45)",
              }}
            >
              <WhatsAppIcon size={19} />
              Contact Us
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* ══════════════════════ MOBILE MENU ══════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[99] flex flex-col lg:hidden"
            style={{ background: "rgba(6,6,10,0.96)", backdropFilter: "blur(20px)" }}
          >
            {/* Glow accent */}
            <div
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)" }}
            />

            <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-6">
              {/* Home link in mobile */}
              {[{ to: "/" as const, label: "Home" }, ...NAV].map((n, i) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                return (
                  <motion.div
                    key={n.to}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ delay: i * 0.05, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-xs"
                  >
                    <Link
                      to={n.to}
                      className="flex w-full items-center justify-between rounded-2xl px-6 py-4 transition-colors"
                      style={{
                        background: active ? "rgba(255,90,31,0.12)" : "transparent",
                        border: `1px solid ${active ? "rgba(255,90,31,0.25)" : "transparent"}`,
                        color: active ? "#FF7A3F" : "rgba(255,255,255,0.65)",
                      }}
                    >
                      <span className="text-lg font-semibold tracking-tight">{n.label}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-40" />
                    </Link>
                  </motion.div>
                );
              })}

              {/* Place Order (Email / Order Form) CTA */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: (NAV.length + 1) * 0.05 + 0.04, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 flex w-full max-w-xs flex-col gap-2.5"
              >
                <Link
                  to="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/90 py-3.5 text-base font-bold text-gray-900 shadow-md backdrop-blur-md"
                >
                  <Mail className="h-5 w-5 text-[#FF5A1F]" />
                  Place Order (Email)
                </Link>

                {/* WhatsApp CTA */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-base font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #FF5A1F 0%, #FF7A00 100%)",
                    boxShadow: "0 0 32px rgba(255,90,31,0.35)",
                  }}
                >
                  <WhatsAppIcon size={20} />
                  Contact Us on WhatsApp
                </a>
              </motion.div>
            </nav>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="pb-8 text-center text-xs tracking-widest text-white/20 uppercase"
            >
              ContentMesh © {new Date().getFullYear()}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

