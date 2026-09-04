import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center justify-start text-left ${className}`} aria-label="ContentMesh home">
      <picture className="flex items-center justify-start">
        <source srcSet="/Content_mesh_AI_video_production_agency.avif" type="image/avif" />
        <img
          src="/Content_mesh_AI_video_production_agency.webp"
          alt="ContentMesh"
          width={180}
          height={56}
          className="h-12 w-auto object-contain object-left sm:h-14"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          style={{ maxWidth: "180px", aspectRatio: "180/56" }}
        />
      </picture>
    </Link>
  );
}
