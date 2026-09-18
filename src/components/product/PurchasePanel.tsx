"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product, ProductVariant } from "@/lib/store/types";
import { formatPrice } from "@/lib/format";
import { grossUnit, vatRate } from "@/lib/store/vat";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";

/** Χρώματα swatch για τις γνωστές ονομασίες του καταλόγου. */
const SWATCHES: Record<string, string> = {
  "Λιλά": "#cdb9e6",
  "Φυστικί": "#c9d3be",
  "Ανθρακί": "#5b6660",
  "Πράσινο": "#2d6247",
  "Πορτοκαλί": "#f0731f",
  "Κρεμ": "#f3eee4",
};

const COLOR_KEYS = ["Χρώμα", "Colour", "Color"];

function optionGroups(variants: ProductVariant[]): { name: string; values: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const v of variants) {
    for (const [name, value] of Object.entries(v.options ?? {})) {
      const list = groups.get(name) ?? [];
      if (!list.includes(value)) list.push(value);
      groups.set(name, list);
    }
  }
  return [...groups.entries()].map(([name, values]) => ({ name, values }));
}

export function PurchasePanel({ product }: { product: Product }) {
  const groups = useMemo(() => optionGroups(product.product_variants), [product]);
  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const first =
      product.product_variants.find((v) => v.inventory_quantity > 0) ??
      product.product_variants[0];
    return { ...(first?.options ?? {}) };
  });
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const { addLine } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.slug);

  const variant = useMemo(() => {
    if (groups.length === 0) return product.product_variants[0] ?? null;
    return (
      product.product_variants.find((v) =>
        groups.every((g) => (v.options ?? {})[g.name] === selection[g.name]),
      ) ?? null
    );
  }, [product.product_variants, groups, selection]);

  // Οι τιμές της βάσης είναι καθαρές· εμφανίζουμε πάντα τη μεικτή («Με ΦΠΑ»).
  const rate = vatRate(product.tax_class);
  const netPrice = variant?.price ?? product.product_variants[0]?.price ?? 0;
  const price = grossUnit(netPrice, rate);
  const compareAt = variant?.compare_at_price
    ? grossUnit(variant.compare_at_price, rate)
    : null;
  const available =
    variant !== null &&
    (variant.inventory_quantity > 0 || variant.inventory_policy === "continue");
  const maxQty = variant
    ? variant.inventory_policy === "continue"
      ? 99
      : Math.max(variant.inventory_quantity, 1)
    : 1;

  /** Είναι διαθέσιμος τουλάχιστον ένας συνδυασμός με αυτή την τιμή; */
  function valueAvailable(groupName: string, value: string): boolean {
    return product.product_variants.some((v) => {
      const opts = v.options ?? {};
      if (opts[groupName] !== value) return false;
      const inStock = v.inventory_quantity > 0 || v.inventory_policy === "continue";
      return inStock;
    });
  }

  function onAdd() {
    if (!variant || !available) return;
    addLine({
      variantId: variant.id,
      quantity,
      title: product.title,
      variantTitle: variant.title,
      slug: product.slug,
      price: grossUnit(variant.price, rate),
      imagePath: product.product_images[0]?.storage_path ?? null,
    });
    setFeedback(`Προστέθηκε στο καλάθι (${quantity} τεμ.)`);
    window.setTimeout(() => setFeedback(null), 4000);
  }

  return (
    <div>
      {product.product_type && (
        <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
          {product.product_type}
        </p>
      )}
      <h1 className="mt-1.5 font-display text-3xl font-extrabold leading-tight text-ink lg:text-4xl">
        {product.title}
      </h1>
      {product.description && (
        <p className="mt-2 text-base text-ink-soft">
          {product.description.split(".")[0]}.
        </p>
      )}

      <div className="mt-5">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl font-extrabold text-ink">
            {formatPrice(price)}
          </span>
          {compareAt && (
            <span className="text-lg text-ink-soft line-through">{formatPrice(compareAt)}</span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-ink-soft">Με ΦΠΑ</p>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
          <span
            aria-hidden
            className={`h-2.5 w-2.5 rounded-full ${available ? "bg-forest" : "bg-ink-soft"}`}
          />
          <span className={available ? "text-forest" : "text-ink-soft"}>
            {available ? "Διαθέσιμο" : "Εξαντλήθηκε"}
          </span>
        </p>
      </div>

      {groups.map((group) => {
        const isColor = COLOR_KEYS.includes(group.name);
        return (
          <fieldset key={group.name} className="mt-6">
            <legend className="text-sm font-bold text-ink">
              {group.name}
              {isColor && selection[group.name] ? `: ${selection[group.name]}` : ""}
            </legend>
            {!isColor && (
              <Link
                href="/selida/odigos-megethon"
                className="float-right -mt-6 text-sm font-semibold text-forest hover:underline"
              >
                Οδηγός μεγεθών →
              </Link>
            )}
            {/* Χρώματα: ελεύθερη ροή. Μεγέθη: ίσες θέσεις σε όλο το πλάτος
                του panel, όπως το mockup. */}
            <div className={isColor ? "mt-2.5 flex flex-wrap gap-3" : "mt-2.5 grid grid-cols-4 gap-2.5"}>
              {group.values.map((value) => {
                const selected = selection[group.name] === value;
                const enabled = valueAvailable(group.name, value);
                if (isColor) {
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelection((s) => ({ ...s, [group.name]: value }))}
                      aria-label={value}
                      aria-pressed={selected}
                      disabled={!enabled}
                      className={`h-11 w-11 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                        selected ? "border-forest ring-2 ring-forest/25" : "border-line"
                      }`}
                      style={{ backgroundColor: SWATCHES[value] ?? "#e5e0d5" }}
                    />
                  );
                }
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelection((s) => ({ ...s, [group.name]: value }))}
                    aria-pressed={selected}
                    disabled={!enabled}
                    className={`rounded-[0.6rem] border px-4 py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      selected
                        ? "border-forest bg-forest text-white"
                        : "border-line bg-white text-ink hover:border-forest"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            {!isColor && (
              <p className="mt-2 text-xs text-ink-soft">
                Μέτρησε την περίμετρο του στήθους πριν επιλέξεις.
              </p>
            )}
          </fieldset>
        );
      })}

      {/* Στο mobile το CTA παίρνει δική του σειρά ώστε να μη σπάει σε δύο γραμμές. */}
      <div className="mt-7 grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center gap-1 rounded-[0.6rem] border border-line bg-white px-2 py-1.5">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Μείωση ποσότητας"
            className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink transition-colors hover:bg-sand"
          >
            −
          </button>
          <span aria-live="polite" className="w-8 text-center text-sm font-bold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            aria-label="Αύξηση ποσότητας"
            className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-ink transition-colors hover:bg-sand"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={!available}
          className="col-span-3 row-start-2 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[0.6rem] bg-tangerine px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark disabled:cursor-not-allowed disabled:bg-ink-soft sm:col-span-1 sm:col-start-2 sm:row-start-1"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5" aria-hidden>
            <path
              d="M3 5h2l2.2 11.2A2 2 0 0 0 9.2 18h8.6a2 2 0 0 0 2-1.6L21.5 9H6M10 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {available ? "Προσθήκη στο καλάθι" : "Εξαντλήθηκε"}
        </button>

        <button
          type="button"
          onClick={() => toggle(product.slug)}
          aria-pressed={wished}
          aria-label={wished ? "Αφαίρεση από τα αγαπημένα" : "Προσθήκη στα αγαπημένα"}
          className={`col-start-3 row-start-1 flex h-12 w-12 items-center justify-center rounded-[0.6rem] transition-colors sm:col-start-3 ${
            wished ? "text-tangerine" : "text-ink-soft hover:text-tangerine"
          }`}
        >
          <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" className="h-7 w-7" aria-hidden>
            <path
              d="M12 20.3 4.9 13a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5Z"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm font-semibold text-forest">
        {feedback}
      </p>
    </div>
  );
}
