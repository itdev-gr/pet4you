import Image from "next/image";
import Link from "next/link";
import type { BlogPostCard } from "@/lib/store/types";
import { contentImageUrl } from "@/lib/store/images";
import { Container, SectionHeading } from "@/components/Section";

export function BlogTeasers({ posts }: { posts: BlogPostCard[] }) {
  if (posts.length === 0) return null;
  return (
    <Container as="section">
      <SectionHeading
        title="Μικρές συμβουλές. Μεγάλη αγάπη."
        action={
          <Link href="/blog" className="text-sm font-bold text-forest hover:underline">
            Όλα τα άρθρα →
          </Link>
        }
      />
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const img = contentImageUrl(post.cover_image);
          return (
            <article key={post.slug} className="group">
              <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-sand">
                {img && (
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              {post.excerpt && (
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 inline-block text-sm font-bold text-forest hover:underline"
              >
                Διάβασε περισσότερα →
              </Link>
            </article>
          );
        })}
      </div>
    </Container>
  );
}
