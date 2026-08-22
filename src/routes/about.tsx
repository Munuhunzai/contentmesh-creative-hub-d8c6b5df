import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Stats } from "@/components/home/Stats";
import { CTA } from "@/components/home/CTA";
import { Target, Eye, Heart, Building2 } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { teamQuery } from "@/integrations/sanity/queries";
import { optimizeSanityImage } from "@/lib/sanity-image";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ContentMesh | Leading AI Video Production Company" },
      {
        name: "description",
        content:
          "Learn about ContentMesh — a premier AI video creation company blending generative AI models with senior post-production craft for commercial ads, animation, and brand storytelling.",
      },
      {
        name: "keywords",
        content:
          "ai video production company, ai video creation company, ai video company, ai video animation company, about contentmesh",
      },
      { property: "og:title", content: "About ContentMesh | Leading AI Video Production Company" },
      {
        property: "og:description",
        content:
          "The team, mission and studio behind ContentMesh — pioneering the future of AI video production.",
      },
      { property: "og:url", content: "https://contentmesh.ai/about" },
    ],
    links: [{ rel: "canonical", href: "https://contentmesh.ai/about" }],
  }),
  component: About,
});

const PILLARS = [
  { icon: Target, t: "Mission", d: "Give every brand a world-class creative team on demand." },
  { icon: Eye, t: "Vision", d: "A future where AI and taste ship stories at the speed of ideas." },
  { icon: Heart, t: "Values", d: "Craft, honesty, speed, and relentless usefulness for clients." },
  {
    icon: Building2,
    t: "Studio",
    d: "In-house production stage, edit bays, and a dedicated VO booth.",
  },
];

type TeamMember = {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  photoUrl?: string | null;
};

const TEAM_FALLBACK: TeamMember[] = [
  { _id: "t1", name: "Ava Morgan", role: "Creative Director" },
  { _id: "t2", name: "Leo Park", role: "Head of AI Production" },
  { _id: "t3", name: "Sara Bello", role: "Executive Producer" },
  { _id: "t4", name: "Ethan Cole", role: "Lead Motion Designer" },
];

const ACCENTS = ["#FF5A1F", "#0D4C92", "#F6C244", "#111"];

function About() {
  const team = useSanity<TeamMember[]>(["sanity", "team"], teamQuery, TEAM_FALLBACK);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title="A modern studio for the AI era"
        desc="We're a small, senior team of directors, editors, and technologists building the future of branded content."
      />

      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-12">
          <p className="font-display text-2xl leading-snug tracking-tight sm:text-3xl">
            ContentMesh started as a bet:{" "}
            <span className="gradient-text">
              that AI + real craft would beat traditional agency pipelines
            </span>{" "}
            — in speed, in quality, and in cost. Two years later, we produce work for hundreds of
            brands across four continents.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-white">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{p.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Stats />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Meet the AI Video Directors & Engineers Behind ContentMesh
        </h2>
        <p className="mt-2 text-muted-foreground">
          Senior filmmakers, prompt engineers, and motion designers deeply hands-on with every
          production.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div
                className="aspect-[4/5] relative"
                style={
                  m.photoUrl
                    ? { background: `url(${optimizeSanityImage(m.photoUrl, 600, 70)}) center/cover` }
                    : {
                        background: `linear-gradient(135deg, ${ACCENTS[i % ACCENTS.length]}, #0D4C92)`,
                      }
                }
              >
                {!m.photoUrl && (
                  <>
                    <div className="absolute inset-0 mesh-bg opacity-20" />
                    <p className="absolute bottom-4 left-4 font-display text-4xl font-bold text-white/90">
                      {m.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </p>
                  </>
                )}
              </div>
              <div className="p-4">
                <p className="font-display font-semibold">{m.name}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
                {m.bio && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{m.bio}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <CTA />
    </SiteLayout>
  );
}
