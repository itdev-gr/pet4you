import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  getCatalog,
  getCategoryBySlug,
  getChildCategories,
  type CatalogFilters,
} from "@/lib/store/queries";
import { Container } from "@/components/Section";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { Filters, SortSelect } from "@/components/catalog/Filters";

export const revalidate = 300;

type SearchParams = Record<string, string | string[] | undefined>;
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Η κατηγορία δεν βρέθηκε" };
  return {
    title: category.name,
    description: category.description ?? `Προϊόντα στην κατηγορία ${category.name}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const children = await getChildCategories(category.id);
  const categoryIds = [category.id, ...children.map((c) => c.id)];

  const filters: CatalogFilters = {
    categoryIds,
    vendors: one(sp.vendor)?.split(",").filter(Boolean),
    minPrice: one(sp.min) ? Number(one(sp.min)) : undefined,
    maxPrice: one(sp.max) ? Number(one(sp.max)) : undefined,
    inStockOnly: one(sp.stock) === "1",
    sort: one(sp.sort) as CatalogFilters["sort"],
  };
  const { products, vendors, priceRange, total } = await getCatalog(filters);

  const parentCrumb: Crumb[] = category.parent_id
    ? [{ label: category.name }]
    : [{ label: category.name }];

  return (
    <div className="pb-16">
      <Breadcrumbs items={parentCrumb} />
      <Container>
        <h1 className="font-display text-3xl font-extrabold text-ink">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">{category.description}</p>
        )}

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <Suspense fallback={<div className="lg:w-60" />}>
            <Filters vendors={vendors} priceRange={priceRange} subcategories={children} />
          </Suspense>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-soft">
                {total} {total === 1 ? "προϊόν" : "προϊόντα"}
              </p>
              <Suspense fallback={null}>
                <SortSelect />
              </Suspense>
            </div>

            {products.length === 0 ? (
              <div className="mt-8 rounded-card border border-line bg-white p-10 text-center">
                <p className="font-display text-lg font-bold text-ink">
                  Δεν βρήκαμε προϊόντα με αυτά τα φίλτρα.
                </p>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Δοκίμασε να αφαιρέσεις κάποιο φίλτρο ή δες όλη την κατηγορία.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
