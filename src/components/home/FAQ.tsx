import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { faqQuery } from "@/integrations/sanity/queries";
import { SectionHeader } from "./Services";

type FAQ = { _id: string; question: string; answer: string | PortableTextBlock[]; category?: string };

const FALLBACK: FAQ[] = [
  {
    _id: "1",
    question: "What makes an AI video production agency different from traditional video production companies?",
    answer: "As a specialized AI video production agency and creation company, ContentMesh combines generative AI video models (Runway Gen-3, Sora-class, Kling, Luma) with senior human post-production. This cuts production timelines by up to 78% and reduces budget requirements while delivering studio-grade commercial ads, animations, and social reels.",
  },
  {
    _id: "2",
    question: "What AI video production services do you provide?",
    answer: "Our full-stack AI video production services include: AI commercial video ads, 2D & 3D AI animation, custom AI avatar creation for company onboarding and training, AI video dubbing & translation in 40+ languages, UGC video editing for performance marketing, image-to-video conversion, and motion graphics.",
  },
  {
    _id: "3",
    question: "Can your AI video creation company build custom avatars for company onboarding and product explainers?",
    answer: "Yes! We specialize in custom AI avatar creation services for corporate onboarding, sales presentations, self-service helpdesk portals, and multi-format training videos. Our avatars feature hyper-realistic lip-syncing and natural voiceover synthesis.",
  },
  {
    _id: "4",
    question: "How do your AI video dubbing, voiceover, and translation services work?",
    answer: "Our AI video translation and dubbing services clone voices with emotional nuance, localized accents, and automatic lip-sync alignment across 40+ languages (including Spanish, French, German, Japanese, and Brazilian Portuguese) — perfect for international brand campaigns.",
  },
  {
    _id: "5",
    question: "How fast is your turnaround for AI video editing and commercial ad campaigns?",
    answer: "Standard projects ship in 3–5 business days. Our Professional and Enterprise retainer members receive 48-hour priority queue turnaround for commercial ads, social reels, and UGC video edits.",
  },
  {
    _id: "6",
    question: "Can you transform raw footage, photos, or text scripts into polished AI videos?",
    answer: "Yes. Whether you have text scripts, product photos, raw UGC footage, or audio recordings, our AI-powered photo-to-video and script-to-screen pipeline handles full assembly, color grading, kinetic motion graphics, and audio mastering.",
  },
  {
    _id: "7",
    question: "Is your AI video production pipeline brand-safe and copyright-compliant?",
    answer: "100%. We operate under enterprise NDAs, use licensed commercial AI models, and build isolated asset pipelines. All delivered master files include full commercial usage rights for Meta, YouTube, CTV, TikTok, and web distribution.",
  },
  {
    _id: "8",
    question: "What pricing options do you offer for AI video production retainers?",
    answer: "We offer transparent monthly retainers starting at $1.5k/mo (Starter Plan) and $2k/mo (Professional Plan with unlimited revisions and 48h priority turnaround), as well as custom Enterprise solutions for high-volume content teams.",
  },
];

export function FAQ_() {
  const faqs = useSanity<FAQ[]>(["sanity", "faq"], faqQuery, FALLBACK);
  const items = faqs && faqs.length > 0 ? faqs : FALLBACK;

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 sm:py-32" id="faq">
      <SectionHeader
        eyebrow="FAQ & Insights"
        title="Frequently Asked Questions About AI Video Production Services"
        desc="Everything you need to know about working with an AI video production agency, our workflows, turnarounds, and capabilities."
      />
      <Accordion type="single" collapsible className="mt-14 w-full space-y-4">
        {items.map((f) => (
          <AccordionItem
            key={f._id}
            value={f._id}
            className="glass glass-reflect overflow-hidden rounded-2xl border border-border/60 px-6 shadow-glass"
          >
            <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline sm:text-lg">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {typeof f.answer === "string" ? f.answer : <PortableText value={f.answer} />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
