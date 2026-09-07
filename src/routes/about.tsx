import { seoHead } from "@/lib/site";
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
  head: () =>
    seoHead(
      "About ContentMesh | AI Video Production Studio",
      "Meet ContentMesh, an AI content studio combining creative direction, video generation, editing and sound design for brands and creators.",
      "/about",
    ),
  component: About,
});

const PILLARS = [
  { icon: Target, t: "Mission", d: "Give every brand a world-class creative team on demand." },
  { icon: Eye, t: "Vision", d: "More room for original stories through thoughtful use of AI." },
  { icon: Heart, t: "Values", d: "Craft, honesty, speed, and relentless usefulness for clients." },
  {
    icon: Building2,
    t: "Studio",
    d: "AI production, editing and sound workflows shaped around each project.",
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
  {
    _id: "founder",
    name: "Ejaz Uddin",
    role: "Founder & CEO",
    bio: "AI video creator and founder of ContentMesh Studios.",
  },
];

const ACCENTS = ["#FF5A1F", "#0D4C92", "#F6C244", "#111"];

function About() {
  const publishedTeam = useSanity<TeamMember[]>(["sanity", "team"], teamQuery, TEAM_FALLBACK);
  const team = publishedTeam.length ? publishedTeam : TEAM_FALLBACK;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title="Human judgement. New possibilities."
        desc="ContentMesh Studios brings creative direction, AI video production and post-production together for brands and creators."
      />

      <section className="studio-section !pb-0">
        <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-12">
          <p className="font-display text-2xl leading-snug tracking-tight sm:text-3xl">
            A powerful tool is only the beginning.{" "}
            <span className="text-brand-blue">
              The story, the visual decisions and the care in the edit
            </span>{" "}
            turn an idea into something worth watching. That is the work we focus on at ContentMesh.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.t}
              initial={false}
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
          The people behind the work.
        </h2>
        <p className="mt-2 text-muted-foreground">
          Creative direction starts with a conversation. Get to know the people shaping your
          project.
        </p>
        <div
          className={`mt-10 grid gap-6 ${team.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "max-w-xl"}`}
        >
          {team.map((m, i) => (
            <motion.div
              key={m._id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div
                className="aspect-[4/5] relative"
                style={
                  m.photoUrl
                    ? {
                        background: `url(${optimizeSanityImage(m.photoUrl, 400, 60)}) center/cover`,
                      }
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
