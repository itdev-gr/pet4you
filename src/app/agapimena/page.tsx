import type { Metadata } from "next";
import { getCatalog } from "@/lib/store/queries";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Section";
import { WishlistGrid } from "@/components/product/WishlistGrid";

export const metadata: Metadata = { title: "Τα αγαπημένα μου" };
export const revalidate = 300;

export default async function WishlistPage() {
  // Όλος ο κατάλογος φτάνει στον client· η επιλογή ζει τοπικά στον browser.
  const { products } = await getCatalog({});

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: "Τα αγαπημένα μου" }]} />
      <Container>
        <h1 className="font-display text-[1.75rem] font-extrabold text-ink">Τα αγαπημένα μου</h1>
        <WishlistGrid products={products} />
      </Container>
    </div>
  );
}
