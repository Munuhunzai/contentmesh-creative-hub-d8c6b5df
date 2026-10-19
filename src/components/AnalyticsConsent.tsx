import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

import {
  ANALYTICS_KEY as KEY,
  analyticsAllowed,
  isPrivateAnalyticsPath,
  storedAnalyticsChoice,
} from "@/lib/analytics-policy";
type Clarity = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global {
  interface Window {
    clarity?: Clarity;
  }
}

function startClarity() {
  if (document.getElementById("contentmesh-clarity")) return;
  window.clarity ||= Object.assign(
    (...args: unknown[]) => {
      window.clarity!.q ||= [];
      window.clarity!.q.push(args);
    },
    { q: [] as unknown[][] },
  );
  window.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
  const script = document.createElement("script");
  script.id = "contentmesh-clarity";
  script.async = true;
  script.src = "https://www.clarity.ms/tag/yugwoztd8k";
  document.head.appendChild(script);
}

export function AnalyticsConsent() {
  const { pathname } = useLocation();
  const [choice, setChoice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const privatePage = isPrivateAnalyticsPath(pathname);

  useEffect(() => {
    try {
      setChoice(storedAnalyticsChoice(localStorage.getItem(KEY)));
    } catch {
      /* Storage may be unavailable; default to no tracking. */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (privatePage) {
      // A full navigation removes any recorder left running by an SPA transition.
      if (document.getElementById("contentmesh-clarity")) location.reload();
      return;
    }
    if (analyticsAllowed(location.hostname, pathname, choice)) startClarity();
  }, [ready, choice, privatePage, pathname]);

  function choose(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
    } catch {
      /* Session-only choice. */
    }
    setChoice(value);
    setOpen(false);
    if (value === "rejected" && window.clarity) {
      window.clarity("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
      // Reload stops recording entirely, including cookieless collection.
      location.reload();
    }
  }

  if (!ready || privatePage) return null;
  return (
    <div data-clarity-mask="true">
      <button
        className="fixed bottom-3 left-3 z-50 rounded border bg-background px-3 py-2 text-xs text-foreground shadow"
        onClick={() => setOpen(true)}
      >
        Privacy choices
      </button>
      {(choice === null || open) && (
        <section
          aria-label="Optional analytics"
          className="fixed bottom-14 left-3 right-3 z-50 max-w-lg rounded-xl border bg-background p-5 text-foreground shadow-lg"
        >
          <h2 className="font-semibold">Help improve ContentMesh</h2>
          <p className="my-3 text-sm">
            With your permission, Microsoft Clarity uses cookies, heatmaps and session recordings to
            help us understand clicks, scrolling and navigation. Optional analytics stays off until
            you accept. You can change your choice anytime.
          </p>
          <a className="text-sm underline" href="/privacy">
            Privacy policy
          </a>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded border px-4 py-2 text-sm" onClick={() => choose("rejected")}>
              Reject analytics
            </button>
            <button className="rounded border px-4 py-2 text-sm" onClick={() => choose("accepted")}>
              Accept analytics
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
