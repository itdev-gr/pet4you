import type { Metadata } from "next";
import { Suspense } from "react";
import { getCatalog, type CatalogFilters } from "@/lib/store/queries";
import { Container } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { Filters, SortSelect } from "@/components/catalog/Filters";

export const metadata: Metadata = { title: "Αναζήτηση" };

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const term = one(sp.q)?.trim() ?? "";

  const filters: CatalogFilters = {
    search: term || undefined,
    vendors: one(sp.vendor)?.split(",").filter(Boolean),
    minPrice: one(sp.min) ? Number(one(sp.min)) : undefined,
    maxPrice: one(sp.max) ? Number(one(sp.max)) : undefined,
    inStockOnly: one(sp.stock) === "1",
    sort: one(sp.sort) as CatalogFilters["sort"],
  };
  const { products, vendors, priceRange, total } = term
    ? await getCatalog(filters)
    : { products: [], vendors: [], priceRange: { min: 0, max: 0 }, total: 0 };

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: "Αναζήτηση" }]} />
      <Container>
        <h1 className="font-display text-3xl font-extrabold text-ink">
          {term ? `Αποτελέσματα για «${term}»` : "Αναζήτηση"}
        </h1>

        <form action="/anazitisi" role="search" className="relative mt-4 max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={term}
            placeholder="Τι ψάχνεις για το κατοικίδιό σου;"
            className="w-full rounded-full border border-line bg-white py-3 pl-5 pr-28 text-sm outline-none focus:border-forest"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 rounded-full bg-tangerine px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
          >
            Αναζήτηση
          </button>
        </form>

        {term && (
          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            <Suspense fallback={<div className="lg:w-60" />}>
              <Filters vendors={vendors} priceRange={priceRange} subcategories={[]} />
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
                    Δεν βρήκαμε κάτι για «{term}».
                  </p>
                  <p className="mt-1.5 text-sm text-ink-soft">
                    Δοκίμασε διαφορετική λέξη ή δες τις κατηγορίες μας.
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
        )}
      </Container>
    </div>
  );
}
