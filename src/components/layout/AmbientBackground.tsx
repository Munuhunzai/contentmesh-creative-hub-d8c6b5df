/**
 * Ambient background with light orange paper texture and warm radial glows.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base warm light orange cream background */}
      <div className="absolute inset-0 bg-[#FAF3EE]" />

      {/* Light orange crumpled paper texture overlay */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply bg-repeat bg-center bg-[length:540px_auto]"
        style={{
          backgroundImage: "url('/bg-texture.webp')",
        }}
      />

      {/* Subtle warm radial ambient glows */}
      <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,90,31,0.14),transparent_60%)] blur-3xl" />
      <div className="absolute right-[-15%] top-[15%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(255,140,90,0.12),transparent_60%)] blur-3xl" />
      <div className="absolute left-[25%] top-[55%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,180,140,0.10),transparent_60%)] blur-3xl" />

      {/* Edge vignette wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_60%,rgba(255,90,31,0.04)_100%)]" />
    </div>
  );
}
