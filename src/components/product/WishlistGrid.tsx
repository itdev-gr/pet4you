"use client";

import Link from "next/link";
import type { ProductCard as ProductCardData } from "@/lib/store/types";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlist } from "@/lib/wishlist/WishlistContext";

export function WishlistGrid({ products }: { products: ProductCardData[] }) {
  const { slugs, hydrated } = useWishlist();

  if (!hydrated) return <p className="mt-6 text-sm text-ink-soft">Φόρτωση…</p>;

  const selected = products.filter((p) => slugs.includes(p.slug));

  if (selected.length === 0) {
    return (
      <div className="mt-6 rounded-card border border-line bg-white p-12 text-center">
        <p className="font-display text-xl font-bold text-ink">Δεν έχεις αγαπημένα ακόμα.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Πάτησε την καρδιά σε ό,τι σου αρέσει και θα το βρεις εδώ.
        </p>
        <Link
          href="/katigoria/skylos"
          className="mt-5 inline-block rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
        >
          Δες τα προϊόντα
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-sm text-ink-soft">
        {selected.length} {selected.length === 1 ? "προϊόν" : "προϊόντα"}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {selected.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
