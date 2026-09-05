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
    <section className="paper-section relative overflow-hidden px-6 py-8 sm:py-12">
      <div className="paper-surface paper-fold-corner mx-auto max-w-6xl rounded-[2px_34px_4px_28px] px-6 py-16 text-center sm:px-12 sm:py-24">
        <div className="absolute bottom-0 left-0 h-16 w-24 bg-[#C23800]/10 [clip-path:polygon(0_0,100%_100%,0_100%)]" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="paper-tag text-xs font-bold uppercase tracking-[0.25em]"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 font-display text-4xl font-black leading-tight tracking-tight sm:text-6xl"
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
