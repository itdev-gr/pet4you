import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Newsletter } from "@/components/home/Newsletter";
import { getPublishedPosts } from "@/lib/store/queries";
import { contentImageUrl } from "@/lib/store/images";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Μικρές συμβουλές. Μεγάλη αγάπη.",
  description: "Ιδέες και συμβουλές για τη φροντίδα και την καθημερινότητα του κατοικιδίου σου.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="space-y-12 pb-8">
      <Breadcrumbs items={[{ label: "Συμβουλές & νέα" }]} />
      <Container>
        <header className="mb-8 max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-forest">Συμβουλές & νέα</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">Μικρές συμβουλές. Μεγάλη αγάπη.</h1>
          <p className="mt-4 text-ink-soft">Ιδέες για περισσότερες χαρούμενες στιγμές με τον μικρό σου φίλο.</p>
        </header>
        {posts.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => {
              const image = contentImageUrl(post.cover_image);
              return (
                <article key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    {image && <div className="relative mb-4 aspect-[3/2] overflow-hidden rounded-card bg-sand"><Image src={image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform group-hover:scale-105" /></div>}
                    <h2 className="font-display text-xl font-bold group-hover:text-forest">{post.title}</h2>
                    {post.excerpt && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>}
                    <span className="mt-3 inline-block text-sm font-semibold text-forest">Διάβασε περισσότερα →</span>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : <p className="py-12 text-ink-soft">Ετοιμάζουμε νέες συμβουλές για εσένα και το κατοικίδιό σου. Επισκέψου μας ξανά σύντομα.</p>}
      </Container>
      <Newsletter />
    </div>
  );
}
