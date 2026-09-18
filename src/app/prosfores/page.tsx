import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog } from "@/lib/store/queries";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Section";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Προσφορές",
  description: "Τα προϊόντα που βρίσκονται σε προσφορά αυτή τη στιγμή.",
};
export const revalidate = 300;

export default async function OffersPage() {
  const { products } = await getCatalog({});
  const offers = products.filter(
    (p) => p.compareAtPrice !== null && p.compareAtPrice > p.price,
  );

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: "Προσφορές" }]} />
      <Container>
        <h1 className="font-display text-[1.75rem] font-extrabold text-ink">Προσφορές</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Ό,τι αγαπούν, σε τιμή που αγαπάς κι εσύ.
        </p>
        {offers.length === 0 ? (
          <div className="mt-8 rounded-card border border-line bg-white p-10 text-center">
            <p className="font-display text-lg font-bold text-ink">
              Δεν τρέχουν προσφορές αυτή τη στιγμή.
            </p>
            <p className="mt-1.5 text-sm text-ink-soft">
              Γράψου στο newsletter για να μάθεις πρώτος τις επόμενες.
            </p>
            <Link
              href="/katigoria/skylos"
              className="mt-5 inline-block rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
            >
              Δες όλα τα προϊόντα
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {offers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
