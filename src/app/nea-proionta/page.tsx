import type { Metadata } from "next";
import { getCatalog } from "@/lib/store/queries";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Section";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Νέα προϊόντα",
  description: "Οι νέες αφίξεις του pet shop για χαρούμενες πατούσες.",
};
export const revalidate = 300;

export default async function NewProductsPage() {
  const { products } = await getCatalog({});
  const fresh = products.filter((p) => p.isNew);

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: "Νέα προϊόντα" }]} />
      <Container>
        <h1 className="font-display text-[1.75rem] font-extrabold text-ink">Νέα προϊόντα</h1>
        <p className="mt-1 text-sm text-ink-soft">Νέες αφίξεις για χαρούμενες πατούσες.</p>
        {fresh.length === 0 ? (
          <p className="mt-8 rounded-card border border-line bg-white p-10 text-center text-sm text-ink-soft">
            Δεν υπάρχουν νέα προϊόντα αυτή τη στιγμή.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {fresh.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
