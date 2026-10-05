import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { sanityClient } from "@/integrations/sanity/client";
import { getPortfolioNotes, portfolioProjectType } from "@/lib/portfolio-notes";
import {
  getPortfolioPage,
  portfolioPageDescription,
  portfolioPageQuery,
  portfolioEmbedUrl,
  portfolioVideoUrl,
  portfolioOriginalUrl,
  type PortfolioProject,
} from "@/lib/portfolio-pages";
import { breadcrumbs, jsonLd, seoHead, SITE_NAME } from "@/lib/site";

export async function loadPortfolioPage(slug: string) {
  const page = getPortfolioPage(slug);
  if (!page) throw notFound();
  const project = await sanityClient.fetch<PortfolioProject | null>(portfolioPageQuery, { slug });
  if (!project) throw notFound();
  return { page, project };
}

export function portfolioHead(data?: Awaited<ReturnType<typeof loadPortfolioPage>>) {
  if (!data)
    return {
      meta: [{ title: "Project not found | ContentMesh" }, { name: "robots", content: "noindex" }],
    };
  const { page, project } = data;
  return {
    ...seoHead(
      `${page.title} | ${SITE_NAME}`,
      portfolioPageDescription(page.slug),
      `/portfolio/${page.slug}`,
      project.thumbnailUrl || undefined,
    ),
    scripts: [
      {
        type: "application/ld+json",
        children: jsonLd(
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: page.title, path: `/portfolio/${page.slug}` },
          ]),
        ),
      },
    ],
  };
}

export const Route = createFileRoute("/portfolio_/$slug")({
  loader: ({ params }) => loadPortfolioPage(params.slug),
  head: ({ loaderData }) => portfolioHead(loaderData),
  component: ProjectPage,
});

function ProjectPage() {
  return <PortfolioDetail {...Route.useLoaderData()} />;
}

export function PortfolioDetail({ page, project }: Awaited<ReturnType<typeof loadPortfolioPage>>) {
  const notes = getPortfolioNotes(page.slug);
  const kind = portfolioProjectType(project);
  return (
    <SiteLayout>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-6 py-4 text-sm text-muted-foreground"
      >
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link to="/" className="underline">
              Home
            </Link>
            <span aria-hidden="true"> /</span>
          </li>
          <li>
            <Link to="/portfolio" className="underline">
              Portfolio
            </Link>
            <span aria-hidden="true"> /</span>
          </li>
          <li aria-current="page">{page.title}</li>
        </ol>
      </nav>
      <section className="border-b border-border bg-[#f5f6f8]">
        <div className="studio-section !py-8 sm:!py-10">
          <p className="eyebrow">{kind || project.category || "Selected work"}</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-brand-blue">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {portfolioPageDescription(page.slug)}
          </p>
        </div>
      </section>
      <article className="studio-section max-w-5xl space-y-10 !pt-8 sm:!pt-10">
        <section aria-label="Project preview">
          <ProjectMedia key={project._id} project={project} />
          {project.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          )}
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold">About this project</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Published title</dt>
              <dd className="mt-1 font-semibold">{project.title}</dd>
            </div>
            {project.category && (
              <div>
                <dt className="text-sm text-muted-foreground">Format</dt>
                <dd className="mt-1 font-semibold">{project.category}</dd>
              </div>
            )}
            {project.client && (
              <div>
                <dt className="text-sm text-muted-foreground">
                  {kind === "Concept study" || kind === "Personal project"
                    ? "Brand / subject"
                    : "Client"}
                </dt>
                <dd className="mt-1 font-semibold">{project.client}</dd>
              </div>
            )}
          </dl>
        </section>
        {[
          ["Brief", project.brief],
          ["Approach", project.approach],
          ["Outcome", project.outcome],
        ].map(([title, text]) =>
          text ? (
            <section key={title}>
              <h2 className="font-display text-2xl font-bold">{title}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                {text}
              </p>
            </section>
          ) : null,
        )}
        {!!project.deliverables?.length && (
          <section>
            <h2 className="font-display text-2xl font-bold">Deliverables</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {project.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
        {notes && (
          <section className="rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold">Creative possibilities</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Ideas for a future brief inspired by this work; these are not a record of the
              project's production or campaign results.
            </p>
            <h3 className="mt-6 font-semibold">Direction to explore</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{notes.direction}</p>
            <h3 className="mt-6 font-semibold">Planning consideration</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{notes.consideration}</p>
          </section>
        )}
        <section className="border-t border-border pt-8">
          <h2 className="font-display text-2xl font-bold">Plan your own video</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Explore our{" "}
            <Link
              to="/services/$slug"
              params={{ slug: page.serviceSlug }}
              className="underline underline-offset-4"
            >
              {page.serviceLabel}
            </Link>{" "}
            service, or share your audience, message and intended placements with the studio.
          </p>
          <Link
            to="/contact"
            search={{ reference: `Portfolio: ${project.title}` }}
            className="studio-button studio-button-blue mt-6"
          >
            Discuss a similar direction
          </Link>
          <Link to="/portfolio" className="studio-text-link mt-6 ml-6">
            Browse the portfolio
          </Link>
        </section>
      </article>
    </SiteLayout>
  );
}

function ProjectMedia({ project }: { project: PortfolioProject }) {
  const [failed, setFailed] = useState(false);
  const video = portfolioVideoUrl(project.videoFileUrl) || portfolioVideoUrl(project.videoUrl);
  const embed = video ? undefined : portfolioEmbedUrl(project.videoUrl);
  const original =
    portfolioOriginalUrl(project.videoUrl) || portfolioOriginalUrl(project.videoFileUrl);
  return (
    <>
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        {video && !failed ? (
          <video
            src={video}
            controls
            playsInline
            preload="none"
            poster={project.thumbnailUrl}
            onError={() => setFailed(true)}
            aria-label={`${project.title} — project video`}
            className="h-full w-full object-contain"
          />
        ) : embed ? (
          <iframe
            src={embed}
            title={`${project.title} — project video`}
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : project.thumbnailUrl ? (
          original ? (
            <a
              href={original}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${project.title} on the original video host`}
              className="relative block h-full w-full"
            >
              <img
                src={project.thumbnailUrl}
                alt={`${project.title} project still`}
                width={1280}
                height={720}
                className="h-full w-full object-contain"
              />
              <span className="absolute bottom-5 left-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-blue">
                Open original video ↗
              </span>
            </a>
          ) : (
            <img
              src={project.thumbnailUrl}
              alt={`${project.title} project still`}
              width={1280}
              height={720}
              className="h-full w-full object-contain"
            />
          )
        ) : (
          <p className="p-8 text-white">The video preview is currently unavailable.</p>
        )}
      </div>
      {failed && (
        <p role="status" className="mt-4 text-sm text-muted-foreground">
          The video could not play here. You can open the original below.
        </p>
      )}
      {original && (
        <a
          href={original}
          target="_blank"
          rel="noopener noreferrer"
          className="studio-text-link mt-4"
        >
          Open original video
        </a>
      )}
    </>
  );
}
