import Link from "next/link";
import {
  getCollectionsWithProducts,
  getHeroSlides,
  getHomepageCategories,
  getLatestPosts,
  getPartners,
} from "@/lib/store/queries";
import { Hero } from "@/components/home/Hero";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { CollectionTabs } from "@/components/home/CollectionTabs";
import { BrandsStrip } from "@/components/home/BrandsStrip";
import { BlogTeasers } from "@/components/home/BlogTeasers";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductCard } from "@/components/product/ProductCard";
import { PromoBanners, ServiceCards, StoryBanner } from "@/components/home/sections";
import { Container, SectionHeading } from "@/components/Section";

export const revalidate = 300;

export default async function HomePage() {
  const [slides, homepageCategories, collections, partners, posts] = await Promise.all([
    getHeroSlides(),
    getHomepageCategories(),
    getCollectionsWithProducts(),
    getPartners(),
    getLatestPosts(3),
  ]);

  const newProducts = collections.find((c) => c.title === "Νέα προϊόντα");
  const tabCollections = collections.filter((c) => c.title !== "Νέα προϊόντα");

  return (
    <>
      {/* Hero + USP: full-bleed και κολλητά, χωρίς κενό από το nav. */}
      <Hero slide={slides[0]} />

      {/* Ρυθμός ανά μετάβαση, όχι ενιαίο κενό: οι συνδεδεμένες ενότητες
          (προϊόντα → promos → brands → story → services) κάθονται πιο κοντά,
          όπως στο mockup. */}
      <div className="pt-8">
        <CategoryCircles categories={homepageCategories} />
        <div className="mt-12">
          <CollectionTabs collections={tabCollections} />
        </div>

        {newProducts && newProducts.products.length > 0 && (
          <Container as="section" className="mt-12">
            <SectionHeading
              title="New Products"
              subtitle="Νέες αφίξεις για χαρούμενες πατούσες."
              size="large"
              action={
                <Link href="/nea-proionta" className="text-sm font-bold text-forest hover:underline">
                  Όλα τα νέα προϊόντα →
                </Link>
              }
            />
            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {newProducts.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        )}

        {/* Σφιχτός ρυθμός 28–32px ανάμεσα στα συνδεδεμένα blocks. */}
        <div className="mt-8">
          <PromoBanners />
        </div>
        <div className="mt-8">
          <BrandsStrip partners={partners} />
        </div>
        <div className="mt-8">
          <StoryBanner />
        </div>
        <div className="mt-8">
          <ServiceCards />
        </div>
        <div className="mt-12">
          <BlogTeasers posts={posts} />
        </div>
        {/* Το newsletter σχεδόν εφάπτεται στο footer, όπως το mockup. */}
        <div className="mt-12 pb-4">
          <Newsletter />
        </div>
      </div>
    </>
  );
}
