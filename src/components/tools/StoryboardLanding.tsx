import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, ListChecks, Sparkles } from "lucide-react";
import { ServiceLinks } from "@/components/layout/ServiceLinks";

type AccountState = "checking" | "signed-out" | "not-configured";

/** Public content is present in the initial HTML, even while account access loads. */
export function StoryboardLanding({ accountState }: { accountState: AccountState }) {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <Link to="/" className="underline underline-offset-4">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span>Storyboard prompt generator</span>
        </nav>
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Script to storyboard</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              AI storyboard prompt generator
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Turn a script into a scene-by-scene plan with character actions, camera directions,
              visual prompts and sound notes. Use it to prepare an AI commercial, product video or
              YouTube story before you start generating footage.
            </p>
            <p className="mt-4 leading-7 text-slate-600">
              ContentMesh creates a written storyboard and copy-ready prompts. You can review the
              shot sequence, refine the direction and take the prompts into your chosen image or
              video tool. Image rendering and finished video export are separate production steps.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              {accountState !== "not-configured" && (
                <Link
                  to="/signup"
                  search={{ next: "/tools/storyboard-generator" }}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white hover:bg-slate-800"
                >
                  Create account or sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              <a
                href="#storyboard-example"
                className="inline-flex items-center py-3.5 font-semibold text-slate-700 underline underline-offset-4"
              >
                See a storyboard example
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Free account required. 10 AI credits per month. Generate up to 20 scenes per run.
            </p>
            <p role="status" className="mt-2 text-sm text-slate-600">
              {accountState === "checking"
                ? "Checking your account…"
                : accountState === "not-configured"
                  ? "Account access is temporarily unavailable. Please try again later."
                  : "Sign in and confirm your email to start planning."}
            </p>
          </div>
          <aside
            id="storyboard-example"
            className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
            aria-labelledby="example-title"
          >
            <p className="eyebrow">Illustrative example · Product ad</p>
            <h2 id="example-title" className="mt-3 text-2xl font-bold text-slate-950">
              From one script line to a planned shot
            </h2>
            <p className="mt-5 text-sm font-semibold text-slate-950">Script</p>
            <p className="mt-2 leading-7 text-slate-600">
              “A commuter places a reusable bottle into their bag before heading out.”
            </p>
            <dl className="mt-6 space-y-4 text-sm leading-6">
              <div>
                <dt className="font-semibold text-slate-950">Shot and action</dt>
                <dd className="text-slate-600">
                  Medium close-up, 4 seconds. A hand lifts the bottle from a kitchen counter and
                  places it into an open canvas bag.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Visual prompt</dt>
                <dd className="text-slate-600">
                  Soft morning window light, neutral kitchen, eye-level camera, slow push-in. Keep
                  the bottle shape and colour consistent with the product reference. Leave clear
                  space for a headline.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Sound and review notes</dt>
                <dd className="text-slate-600">
                  Bag zip and quiet room tone. Check the hand movement, product proportions and
                  label accuracy before approving the shot.
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-5 text-slate-500">
              Written demonstration, not a generated result or a client project. Actual output
              depends on your script and settings.
            </p>
          </aside>
        </div>
      </section>
      <section
        className="mx-auto max-w-6xl border-t border-slate-200 px-6 py-12"
        aria-labelledby="storyboard-how"
      >
        <h2 id="storyboard-how" className="text-3xl font-bold text-slate-950">
          How to turn a script into a storyboard
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {[
            {
              Icon: FileText,
              title: "1. Add your script",
              text: "Paste a script of up to 12,000 characters. Include the subject, audience, setting and intended action. Clear character descriptions and product details give the plan a useful starting point.",
            },
            {
              Icon: ListChecks,
              title: "2. Choose your direction",
              text: "Set the scene count, visual style, aspect ratio and camera approach. Choose a short sequence for a social ad or a longer breakdown for a narrative. Keep one main action in each planned shot.",
            },
            {
              Icon: Sparkles,
              title: "3. Review and export",
              text: "Read the scene prompts, dialogue and sound notes together. Check continuity and factual details, then copy individual prompts or export the package as Markdown or JSON for your production workflow.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-orange-600" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section
        className="mx-auto max-w-6xl border-t border-slate-200 px-6 py-12"
        aria-labelledby="storyboard-questions"
      >
        <h2 id="storyboard-questions" className="text-3xl font-bold text-slate-950">
          Before you generate
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">How do the free credits work?</h3>
            <p className="mt-3 leading-7 text-slate-600">
              Each account has 10 AI credits per calendar month. A generation of 1–10 scenes uses
              one credit; 11–20 scenes uses two. AI revisions also use credits. Sign in to see your
              remaining allowance before submitting.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              Does it create storyboard images?
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              The tool creates text-based scene plans and prompts, with camera, character and audio
              direction. Render the images or clips in a separate tool, then compare them with the
              plan before editing your video.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              What makes a useful storyboard prompt?
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Specify the subject, action, environment, shot size, camera movement and lighting.
              Repeat essential character and product details across scenes. Review generated
              material for visual consistency and use references you have permission to use.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              Can ContentMesh produce the finished video?
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Yes. For creative direction, shot production and editing,{" "}
              <Link to="/contact" className="font-semibold underline underline-offset-4">
                send us your video brief
              </Link>
              . Include your audience, intended platform, runtime and any existing brand assets so
              we can discuss the scope.
            </p>
          </div>
        </div>
      </section>
      <ServiceLinks />
    </>
  );
}
