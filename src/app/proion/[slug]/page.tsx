import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getProductBySlug,
  getProductCategories,
  getProductEditorial,
  getRelatedProducts,
} from "@/lib/store/queries";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { InfoRows } from "@/components/product/InfoRows";
import { Editorial } from "@/components/product/Editorial";
import { Accordion, type AccordionItem } from "@/components/product/Accordion";
import { ProductCard } from "@/components/product/ProductCard";
import { Newsletter } from "@/components/home/Newsletter";
import { Container } from "@/components/Section";
import { productImageUrl } from "@/lib/store/images";
import { grossUnit, vatRate } from "@/lib/store/vat";
import { jsonLdScript } from "@/lib/format";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Το προϊόν δεν βρέθηκε" };
  return {
    title: product.title,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, editorial] = await Promise.all([
    getProductCategories(product.id),
    getProductEditorial(slug),
  ]);
  const related = await getRelatedProducts(
    product.id,
    categories.map((c) => c.id),
    product.tags,
  );

  // Breadcrumbs: γονική κατηγορία → υποκατηγορία → προϊόν
  const parent = categories.find((c) => c.parent_id === null);
  const child = categories.find((c) => c.parent_id !== null);
  const crumbs: Crumb[] = [
    ...(parent ? [{ label: parent.name, href: `/katigoria/${parent.slug}` }] : []),
    ...(child ? [{ label: child.name, href: `/katigoria/${child.slug}` }] : []),
    { label: product.title },
  ];

  const accordionItems: AccordionItem[] = [
    ...(product.description
      ? [{ title: "Περιγραφή & χαρακτηριστικά", body: product.description }]
      : []),
    ...(editorial?.sections ?? []),
    {
      title: "Αποστολές & επιστροφές",
      body: "Παράδοση με courier σε όλη την Ελλάδα σε 1–3 εργάσιμες. Κόστος 3,50 € — δωρεάν από 39 € και πάνω.\nΈχεις 14 ημέρες για επιστροφή ή αλλαγή, αρκεί το προϊόν να είναι στην αρχική του κατάσταση.",
    },
  ];

  const isNew = product.tags.includes("νέο");
  // Για προϊόντα βόλτας δείχνουμε τα αξεσουάρ βόλτας· αλλιώς την κατηγορία τους.
  const accessoriesSlug = product.tags.includes("βόλτα")
    ? "aksesouar-voltas"
    : (child?.slug ?? parent?.slug ?? "skylos");

  const rate = vatRate(product.tax_class);
  const prices = product.product_variants.map((v) => grossUnit(v.price, rate));
  const inStock = product.product_variants.some(
    (v) => v.inventory_quantity > 0 || v.inventory_policy === "continue",
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    sku: product.product_variants[0]?.sku ?? undefined,
    brand: product.vendor ? { "@type": "Brand", name: product.vendor } : undefined,
    image: product.product_images
      .map((i) => productImageUrl(i.storage_path))
      .filter(Boolean),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.product_variants.length,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Breadcrumbs items={crumbs} />

      <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.9fr]">
        <ProductGallery images={product.product_images} title={product.title} isNew={isNew} />
        <div>
          <PurchasePanel product={product} />
          <InfoRows />
        </div>
      </Container>

      {editorial && <Editorial editorial={editorial} />}

      <Container as="section" className="mt-10">
        <Accordion items={accordionItems} defaultOpen={0} />
      </Container>

      {related.length > 0 && (
        <Container as="section" className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-[1.75rem] font-extrabold text-ink">
              {product.tags.includes("βόλτα")
                ? "Ταιριάζουν στη βόλτα σας."
                : "Ταιριάζουν μαζί."}
            </h2>
            <Link
              href={`/katigoria/${accessoriesSlug}`}
              className="text-sm font-bold text-forest hover:underline"
            >
              {product.tags.includes("βόλτα")
                ? "Δες όλα τα αξεσουάρ →"
                : "Δες όλα τα προϊόντα →"}
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      )}

      <div className="mt-12 pb-2">
        <Newsletter />
      </div>
    </div>
  );
}
