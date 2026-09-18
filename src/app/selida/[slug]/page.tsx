import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/Section";
import { getPublishedPageBySlug } from "@/lib/store/queries";
import { ContentBody } from "@/app/blog/_components/ContentBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
const loadPage = cache(getPublishedPageBySlug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await loadPage((await params).slug);
  if (!page) notFound();
  return { title: page.seo_title || page.title, description: page.seo_description || undefined };
}

export default async function InformationPage({ params }: Props) {
  const page = await loadPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <Breadcrumbs items={[{ label: page.title ?? "Σελίδα" }]} />
      <Container className="min-h-[50vh] pb-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-extrabold leading-tight sm:text-5xl">{page.title}</h1>
        <ContentBody content={page.content} />
      </article>
      </Container>
    </>
  );
}
