"use client";

import { useCallback, useMemo } from "react";
import { createPersistedStore } from "@/lib/persistedStore";

export interface CartLine {
  variantId: string;
  quantity: number;
  /** Snapshot μόνο για εμφάνιση — οι authoritative τιμές έρχονται από τον server. */
  title: string;
  variantTitle: string | null;
  slug: string;
  price: number;
  imagePath: string | null;
}

function isCartLines(value: unknown): value is CartLine[] {
  return (
    Array.isArray(value) &&
    value.every(
      (l): l is CartLine =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as CartLine).variantId === "string" &&
        Number.isFinite((l as CartLine).quantity) &&
        (l as CartLine).quantity > 0 &&
        typeof (l as CartLine).slug === "string" &&
        Number.isFinite((l as CartLine).price),
    )
  );
}

const store = createPersistedStore<CartLine[]>("petshop.cart.v1", [], isCartLines);

interface CartState {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeLine: (variantId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  hydrated: boolean;
}

/**
 * Το καλάθι ζει στον localStorage του επισκέπτη, όχι σε React context: έτσι
 * κάθε component το διαβάζει απευθείας και δεν χρειάζεται provider γύρω από
 * ολόκληρο το δέντρο.
 */
export function useCart(): CartState {
  const lines = store.useValue();
  const hydrated = store.useHydrated();

  const addLine = useCallback((line: CartLine) => {
    store.update((prev) => {
      const idx = prev.findIndex((l) => l.variantId === line.variantId);
      if (idx === -1) return [...prev, line];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + line.quantity };
      return next;
    });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    store.update((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }, []);

  const removeLine = useCallback((variantId: string) => {
    store.update((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => store.set([]), []);

  return useMemo(
    () => ({
      lines,
      addLine,
      setQuantity,
      removeLine,
      clear,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
      hydrated,
    }),
    [lines, addLine, setQuantity, removeLine, clear, hydrated],
  );
}
