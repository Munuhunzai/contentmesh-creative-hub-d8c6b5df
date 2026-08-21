import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center ${className}`}
      aria-label="ContentMesh home"
    >
      <img
        src="/logo.svg"
        alt="ContentMesh"
        width={180}
        height={56}
        className="h-12 w-auto object-contain sm:h-14"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        style={{ maxWidth: "180px" }}
      />
    </Link>
  );
}
