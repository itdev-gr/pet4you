"use client";

import { useState } from "react";
import Link from "next/link";
import type { CollectionWithProducts } from "@/lib/store/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Container, SectionHeading } from "@/components/Section";

/** Tabs «Τα αγαπημένα τους» — Δημοφιλή / Σκύλος / Γάτα (dashboard collections). */
export function CollectionTabs({ collections }: { collections: CollectionWithProducts[] }) {
  const [active, setActive] = useState(0);
  if (collections.length === 0) return null;
  const current = collections[Math.min(active, collections.length - 1)];

  return (
    <Container as="section">
      <SectionHeading
        title="Τα αγαπημένα τους. Και δικά σου."
        action={
          <Link href="/katigoria/skylos" className="text-sm font-bold text-forest hover:underline">
            Όλα τα προϊόντα →
          </Link>
        }
      />
      {/* Φίλτρα με aria-pressed, όχι role="tab": το πλήρες tab pattern απαιτεί
          roving tabindex και πλοήγηση με βελάκια — μισοϋλοποιημένο θα ήταν
          χειρότερο για screen reader από ένα ειλικρινές κουμπί φίλτρου. */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Φίλτρα συλλογών">
        {collections.map((c, i) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={i === active}
            aria-controls="collection-products"
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              i === active
                ? "bg-tangerine text-white"
                : "border border-line bg-white text-ink hover:border-tangerine"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>
      <div
        id="collection-products"
        aria-live="polite"
        className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4"
      >
        {current.products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </Container>
  );
}
