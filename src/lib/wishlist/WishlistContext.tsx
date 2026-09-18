"use client";

import { useCallback, useMemo } from "react";
import { createPersistedStore } from "@/lib/persistedStore";

function isSlugList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((s) => typeof s === "string");
}

const store = createPersistedStore<string[]>("petshop.wishlist.v1", [], isSlugList);

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  count: number;
  hydrated: boolean;
}

export function useWishlist(): WishlistState {
  const slugs = store.useValue();
  const hydrated = store.useHydrated();

  const toggle = useCallback((slug: string) => {
    store.update((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  return useMemo(
    () => ({
      slugs,
      toggle,
      has: (slug: string) => slugs.includes(slug),
      count: slugs.length,
      hydrated,
    }),
    [slugs, toggle, hydrated],
  );
}
