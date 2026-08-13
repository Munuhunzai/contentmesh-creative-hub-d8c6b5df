import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/components/theme-provider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ContentMesh — AI-Powered Creative Content Studio" },
      { name: "description", content: "ContentMesh crafts AI videos, animations, voiceovers, and premium marketing content for ambitious brands, creators, and agencies." },
      { name: "author", content: "ContentMesh" },
      { name: "theme-color", content: "#FF5A1F" },
      { property: "og:site_name", content: "ContentMesh" },
      { property: "og:title", content: "ContentMesh — AI-Powered Creative Content Studio" },
      { property: "og:description", content: "ContentMesh crafts AI videos, animations, voiceovers, and premium marketing content for ambitious brands, creators, and agencies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ContentMesh — AI-Powered Creative Content Studio" },
      { name: "twitter:description", content: "ContentMesh crafts AI videos, animations, voiceovers, and premium marketing content for ambitious brands, creators, and agencies." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/ffeef70c-e0bc-41b3-b08a-31faed939538" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/ffeef70c-e0bc-41b3-b08a-31faed939538" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  pendingComponent: RootPendingComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootPendingComponent() {
  return (
    <div className="min-h-screen w-full bg-slate-50 p-6 space-y-8 animate-pulse">
      <div className="h-16 w-full bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between px-6">
        <div className="h-6 w-36 bg-slate-200 rounded-lg" />
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-center space-y-4 pt-8">
        <div className="h-10 w-3/4 bg-slate-200 rounded-xl mx-auto" />
        <div className="h-4 w-1/2 bg-slate-200 rounded-lg mx-auto" />
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="h-32 bg-slate-100 rounded-2xl" />
            <div className="h-5 w-2/3 bg-slate-200 rounded-lg" />
            <div className="h-4 w-full bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
