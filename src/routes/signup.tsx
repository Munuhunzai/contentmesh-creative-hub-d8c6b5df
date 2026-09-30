import { seoHead } from "@/lib/site";
import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { isSupabaseConfigured, supabaseClient } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({
  head: () => {
    const head = seoHead(
      "Sign up or sign in | ContentMesh",
      "Access your ContentMesh account and monthly storyboard credits.",
      "/signup",
    );
    return {
      ...head,
      meta: head.meta.map((meta) =>
        "name" in meta && meta.name === "robots" ? { ...meta, content: "noindex, follow" } : meta,
      ),
    };
  },
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  component: AccountPage,
});

type AuthMode = "signup" | "login";

function safeNextPath() {
  if (typeof window === "undefined") return "/tools/storyboard-generator";
  const candidate = new URLSearchParams(window.location.search).get("next");
  return candidate?.startsWith("/") && !candidate.startsWith("//")
    ? candidate
    : "/tools/storyboard-generator";
}

function AccountPage() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabaseClient) return;
    setBusy(true);
    setError("");
    setNotice("");

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}${safeNextPath()}` },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          window.location.assign(safeNextPath());
          return;
        }
        setNotice(
          "Check your email for a confirmation link. After confirming, you can use the storyboard tool.",
        );
      } else {
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        window.location.assign(safeNextPath());
        return;
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not connect to the account service.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-9">
          <Link
            to="/tools/storyboard-generator"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to storyboard tool
          </Link>
          <div className="mt-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
            {mode === "signup" ? "Create your free account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in to use the storyboard tool. Accounts include 10 AI credits each month; each 10
            scenes uses one credit.
          </p>

          {!isSupabaseConfigured ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Account signup is being set up. Please check back shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <label className="block space-y-2 text-sm font-medium text-slate-800">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block space-y-2 text-sm font-medium text-slate-800">
                Password
                <input
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  placeholder="At least 8 characters"
                />
              </label>
              {error && (
                <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                  {notice}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signup" ? "Create account" : "Sign in"}
              </button>
              <p className="text-center text-sm text-slate-600">
                {mode === "signup" ? "Already have an account?" : "New to ContentMesh?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "signup" ? "login" : "signup");
                    setError("");
                    setNotice("");
                  }}
                  className="font-semibold text-orange-700 hover:underline"
                >
                  {mode === "signup" ? "Sign in" : "Create an account"}
                </button>
              </p>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
