import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { faqQuery } from "@/integrations/sanity/queries";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

type FAQ = {
  _id: string;
  question: string;
  answer: string | PortableTextBlock[];
  category?: string;
};

const FALLBACK: FAQ[] = [
  {
    _id: "brief",
    question: "What do you need to get started?",
    answer:
      "Share your idea, audience and intended channel. Product images, brand guidelines, scripts or visual references are helpful if you have them. We can develop the brief with you.",
  },
  {
    _id: "cost",
    question: "How do you price a project?",
    answer:
      "We scope the creative direction, film length, production complexity and number of versions together. You receive a proposed timeline and quote before production begins. If you don’t have a budget yet, choose ‘Help me estimate’ on the enquiry form.",
  },
  {
    _id: "time",
    question: "How long will production take?",
    answer:
      "Timing depends on the length, visual complexity and feedback rounds. We agree a schedule after reviewing your brief. Tell us about any launch date at the start so we can assess what is practical.",
  },
  {
    _id: "review",
    question: "Will I get to review the work?",
    answer:
      "Yes. We agree review points for the concept, production and final edit. Deliverables and revision rounds are set out in the project scope so everyone knows what is included.",
  },
  {
    _id: "assets",
    question: "Can you work with my existing images or footage?",
    answer:
      "Yes. We can assess your product photography, footage, script and brand assets, then recommend how to combine them with AI visuals and editing. Share a reference when you enquire.",
  },
  {
    _id: "formats",
    question: "Can you create versions for different channels?",
    answer:
      "We can plan landscape, vertical and square versions, along with captions and shorter edits. Tell us where the content will appear so those deliverables can be included in the brief.",
  },
];

export function FAQ_() {
  const faqs = useSanity<FAQ[]>(["sanity", "faq"], faqQuery, FALLBACK);
  const items = faqs && faqs.length > 0 ? faqs : FALLBACK;

  return (
    <section className="studio-section border-t border-border" id="faq">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
        <div>
          <p className="eyebrow">Before we begin</p>
          <h2 className="section-title mt-4">
            Good questions.
            <br />
            Clear answers.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A little clarity on the brief, the process and what happens next.
          </p>
          <Link to="/contact" className="studio-text-link mt-6">
            Ask about your project <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <Accordion type="single" collapsible className="w-full border-t border-border">
          {items.map((f) => (
            <AccordionItem key={f._id} value={f._id} className="border-b border-border px-1">
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline sm:text-lg">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {typeof f.answer === "string" ? f.answer : <PortableText value={f.answer} />}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
