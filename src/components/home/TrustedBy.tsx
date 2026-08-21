import { motion } from "framer-motion";

const LOGOS = ["Nova", "Lumen", "Orbita", "Kairos", "Fjord", "Aurea", "Vantage", "Halo"];

export function TrustedBy() {
  return (
    <section className="border-y border-border/60 bg-secondary/40 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by ambitious teams worldwide
        </p>
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {LOGOS.map((l, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center"
            >
              <span className="font-display text-xl font-bold text-muted-foreground/70 grayscale transition-all hover:text-foreground hover:grayscale-0">
                {l}
                <span className="text-accent">.</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
