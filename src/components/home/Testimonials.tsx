import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useSanity } from "@/integrations/sanity/useSanity";
import { testimonialsQuery } from "@/integrations/sanity/queries";

export type Testimonial = {
  _id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  avatarUrl?: string | null;
  rating?: number;
};

const REVIEWS_DATA: Testimonial[] = [
  {
    _id: "1",
    authorName: "Emily Jeff",
    authorRole: "CEO",
    company: "TheWebagency",
    avatarUrl: "/reviews/emily.webp",
    rating: 5,
    quote:
      "Ten the hastened steepest feelings pleasant few surprise property. An brother he do colonel against.",
  },
  {
    _id: "2",
    authorName: "Hamza Malik",
    authorRole: "Manager",
    company: "TheWekrtech",
    avatarUrl: "/reviews/hamza.webp",
    rating: 5,
    quote:
      "Can how elinor warmly mrs basket marked. Led raising expense yet demesne weather musical. Me mr what.",
  },
  {
    _id: "3",
    authorName: "Elizabeth Rai",
    authorRole: "Developer",
    company: "I2c Company",
    avatarUrl: "/reviews/elizabeth.webp",
    rating: 5,
    quote:
      "park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man. Which way you wrong.",
  },
  {
    _id: "4",
    authorName: "Sara Thomas",
    authorRole: "Accountant",
    company: "TheConsturction",
    avatarUrl: "/reviews/sara.webp",
    rating: 5,
    quote:
      "Concerns greatest margaret him absolute entrance nay. Door neat week do find past he. Be no surprise he honoured.",
  },
];

export function Testimonials() {
  const sanityList = useSanity<Testimonial[]>(["sanity", "testimonials"], testimonialsQuery, []);
  const list = sanityList && sanityList.length > 0 ? sanityList : REVIEWS_DATA;

  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="relative py-20 sm:py-28" id="testimonials">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Section Title ─────────────────────────────────────────────────── */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Client Success: High-ROI Commercials & AI Campaigns
          </h2>
        </div>

        {/* ── 4-Column Cards Grid ───────────────────────────────────────────── */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <motion.div
                key={item._id || idx}
                whileHover={{ y: -6 }}
                onClick={() => setActiveIndex(idx)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                {/* ── Top Half: Gray Container with Avatar & Author Info ───── */}
                <div className="flex items-center gap-4 bg-secondary/50 p-6 pt-7 rounded-t-[1.75rem]">
                  {/* Square Avatar Portrait */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/40 shadow-sm">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.authorName}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 font-bold text-primary text-xl">
                        {item.authorName[0]}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-center">
                    <h3 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                      {item.authorName}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground font-medium">
                      {item.authorRole}
                    </p>
                    <p className="text-xs text-muted-foreground/80 font-normal">
                      {item.company}
                    </p>
                  </div>
                </div>

                {/* ── Middle Rating Star Pill ──────────────────────────────── */}
                <div className="relative z-10 -mt-3.5 mx-auto flex items-center justify-center">
                  <div className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-background px-3.5 py-1 shadow-md">
                    {Array.from({ length: item.rating || 5 }).map((_, k) => (
                      <Star key={k} className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                </div>

                {/* ── Bottom Half: White Quote Container ──────────────────── */}
                <div className="flex flex-1 flex-col justify-center bg-card p-6 pt-5 text-center rounded-b-[1.75rem]">
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {item.quote}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom Pagination Indicators (Exact Cyan Pill Style) ──────────── */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {list.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to review slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 bg-[#FF5A1F]"
                    : "w-6 bg-[#ffb899] opacity-60 hover:opacity-100"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
