import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ServiceLinks } from "@/components/layout/ServiceLinks";
import { getServicePage } from "@/lib/service-pages";
import { absoluteUrl, breadcrumbs, jsonLd, seoHead, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/services_/$slug")({
  loader: ({ params }) => {
    const page = getServicePage(params.slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData: page }) =>
    page
      ? {
          ...seoHead(`${page.title} | ${SITE_NAME}`, page.description, `/services/${page.slug}`),
          scripts: [
            {
              type: "application/ld+json",
              children: jsonLd({
                "@context": "https://schema.org",
                "@type": "Service",
                "@id": absoluteUrl(`/services/${page.slug}#service`),
                name: page.title,
                description: page.summary,
                url: absoluteUrl(`/services/${page.slug}`),
                provider: {
                  "@type": "Organization",
                  "@id": absoluteUrl("/#organization"),
                  name: SITE_NAME,
                  url: absoluteUrl(),
                },
              }),
            },
            {
              type: "application/ld+json",
              children: jsonLd(
                breadcrumbs([
                  { name: "Home", path: "/" },
                  { name: "Services", path: "/services" },
                  { name: page.title, path: `/services/${page.slug}` },
                ]),
              ),
            },
          ],
        }
      : {
          meta: [
            { title: "Service not found | ContentMesh" },
            { name: "robots", content: "noindex" },
          ],
        },
  component: ServicePage,
});

function ServicePage() {
  const page = Route.useLoaderData();
  return (
    <SiteLayout>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-6 py-4 text-sm text-muted-foreground"
      >
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link to="/" className="underline underline-offset-4">
              Home
            </Link>
            <span aria-hidden="true"> /</span>
          </li>
          <li>
            <Link to="/services" className="underline underline-offset-4">
              Services
            </Link>
            <span aria-hidden="true"> /</span>
          </li>
          <li aria-current="page">{page.title}</li>
        </ol>
      </nav>
      <PageHero eyebrow="ContentMesh Studios / Production" title={page.title} desc={page.summary} />
      <div className="studio-section grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="max-w-3xl space-y-10">
          <section>
            <h2 className="font-display text-2xl font-bold">Who this is for</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{page.audience}</p>
          </section>
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-bold">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.text}</p>
            </section>
          ))}
          <section>
            <h2 className="font-display text-2xl font-bold">What to include in your brief</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground">
              {page.brief.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Have a script ready? Use our{" "}
              <Link
                to="/tools/storyboard-generator"
                className="font-semibold text-brand-blue underline underline-offset-4"
              >
                storyboard planning tool
              </Link>{" "}
              to organize your ideas, or send the brief directly for a production discussion.
            </p>
          </section>
          <section aria-labelledby="service-questions">
            <h2 id="service-questions" className="font-display text-2xl font-bold">
              Questions before you commission a video
            </h2>
            <div className="mt-6 space-y-7">
              {page.questions.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
        <aside className="h-fit rounded-2xl border border-border bg-[#f5f6f8] p-7">
          <h2 className="font-display text-xl font-bold">Deliverables to discuss</h2>
          <ul className="mt-5 list-disc space-y-4 pl-5 text-sm leading-relaxed text-muted-foreground">
            {page.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Your quote confirms the exact scope, schedule, revisions and usage terms.
          </p>
          <Link
            to="/contact"
            search={{ reference: `Service: ${page.title}` }}
            className="mt-7 inline-flex min-h-12 items-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white"
          >
            Discuss your project
          </Link>
          <Link
            to="/portfolio"
            className="mt-5 block font-semibold text-brand-blue underline underline-offset-4"
          >
            View selected video work
          </Link>
        </aside>
      </div>
      <ServiceLinks />
    </SiteLayout>
  );
}
