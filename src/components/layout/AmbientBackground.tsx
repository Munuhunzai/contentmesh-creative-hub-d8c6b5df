/**
 * Ambient background with clean white paper texture and soft neutral glows.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f7f3ec]">
      {/* Rich monochrome paper texture overlay */}
      <div
        className="absolute inset-0 opacity-55 mix-blend-multiply bg-repeat bg-center bg-[length:480px_auto]"
        style={{
          backgroundImage: "url('/paper-monochrome.webp')",
        }}
      />

      {/* Large, barely-visible folded color sheets */}
      <div className="absolute -left-32 top-[8%] h-[460px] w-[360px] rotate-[-12deg] bg-[#0E447F]/[0.035] [clip-path:polygon(0_8%,88%_0,100%_82%,18%_100%)]" />
      <div className="absolute -right-28 top-[38%] h-[420px] w-[330px] rotate-[9deg] bg-[#C23800]/[0.03] [clip-path:polygon(8%_0,100%_12%,82%_100%,0_88%)]" />
      <div className="absolute left-[15%] top-[72%] h-[360px] w-[70%] rotate-[-2deg] border border-[#0E447F]/[0.035] bg-white/20 [clip-path:polygon(3%_0,100%_8%,96%_100%,0_91%)]" />

      {/* Subtle edge wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_60%,rgba(0,0,0,0.02)_100%)]" />
    </div>
  );
}
