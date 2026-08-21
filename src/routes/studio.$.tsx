import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const StudioComponent = lazy(() => import("@/sanity/StudioApp"));

export const Route = createFileRoute("/studio/$")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Studio — ContentMesh" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: StudioRoute,
});

function StudioRoute() {
  return (
    <ClientOnly fallback={<StudioLoading />}>
      <Suspense fallback={<StudioLoading />}>
        <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 100 }}>
          <StudioComponent />
        </div>
      </Suspense>
    </ClientOnly>
  );
}

function StudioLoading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#0f172a",
        color: "#fff",
        fontFamily: "system-ui",
      }}
    >
      Loading Sanity Studio…
    </div>
  );
}
