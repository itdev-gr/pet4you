import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Section";
import { Newsletter } from "@/components/home/Newsletter";
import { getPublishedPostBySlug } from "@/lib/store/queries";
import { contentImageUrl } from "@/lib/store/images";
import { ContentBody } from "../_components/ContentBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
const loadPost = cache(getPublishedPostBySlug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) notFound();
  return { title: post.seo_title || post.title, description: post.seo_description || post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();
  const image = contentImageUrl(post.cover_image);
  return (
    <div className="space-y-12 pb-8">
      <Breadcrumbs items={[{ label: "Συμβουλές & νέα", href: "/blog" }, { label: post.title ?? "Άρθρο" }]} />
      <Container>
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-soft">
            {post.author && <span>{post.author}</span>}
            {post.published_at && <time dateTime={post.published_at}>{new Intl.DateTimeFormat("el-GR", { dateStyle: "long", timeZone: "Europe/Athens" }).format(new Date(post.published_at))}</time>}
          </div>
          {post.excerpt && <p className="mt-6 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>}
          {image && <div className="relative my-8 aspect-[3/2] overflow-hidden rounded-card bg-sand"><Image src={image} alt={post.title ?? ""} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" /></div>}
          <div className="mt-8"><ContentBody content={post.content} /></div>
          <Link href="/blog" className="mt-10 inline-block font-semibold text-forest hover:underline">← Όλα τα άρθρα</Link>
        </article>
      </Container>
      <Newsletter />
    </div>
  );
}
