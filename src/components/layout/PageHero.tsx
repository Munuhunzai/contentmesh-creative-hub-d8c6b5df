import { motion } from "framer-motion";

export function PageHero({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mesh-bg absolute inset-0 -z-10 opacity-70" />
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-accent"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
        >
          {title}
        </motion.h1>
        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            {desc}
          </motion.p>
        )}
      </div>
    </section>
  );
}
