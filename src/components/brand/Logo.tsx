import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="ContentMesh home">
      <picture>
        <source srcSet="/Content_mesh_AI_video_production_agency.avif" type="image/avif" />
        <img
          src="/Content_mesh_AI_video_production_agency.webp"
          alt="ContentMesh"
          width={180}
          height={56}
          className="h-12 w-auto object-contain sm:h-14"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          style={{ maxWidth: "180px", aspectRatio: "180/56" }}
        />
      </picture>
    </Link>
  );
}
