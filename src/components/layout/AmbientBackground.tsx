/**
 * Ambient background with clean white paper texture and soft neutral glows.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Neutral white crumpled paper texture overlay */}
      <div
        className="absolute inset-0 opacity-20 bg-repeat bg-center bg-[length:540px_auto]"
        style={{
          backgroundImage: "url('/bg-texture.webp')",
        }}
      />

      {/* Soft neutral ambient washes */}
      <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(240,240,245,0.6),transparent_60%)] blur-3xl" />
      <div className="absolute right-[-15%] top-[15%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(245,245,250,0.5),transparent_60%)] blur-3xl" />
      <div className="absolute left-[25%] top-[55%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(240,242,248,0.5),transparent_60%)] blur-3xl" />

      {/* Subtle edge wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_60%,rgba(0,0,0,0.02)_100%)]" />
    </div>
  );
}
