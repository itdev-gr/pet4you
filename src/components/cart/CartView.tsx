"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { productImageUrl } from "@/lib/store/images";
import { formatPrice } from "@/lib/format";

interface QuoteLine {
  variantId: string;
  title: string;
  slug: string;
  variantTitle: string | null;
  price: number;
  lineTotal: number;
  quantity: number;
  requestedQuantity: number;
  maxQuantity: number;
  adjusted: boolean;
  outOfStock: boolean;
  imagePath: string | null;
}

interface Quote {
  lines: QuoteLine[];
  subtotal: number;
  shipping: { label: string; cost: number; freeFrom: number | null } | null;
  total: number | null;
  shippingError?: string;
}

export function CartView() {
  const { lines, setQuantity, removeLine, hydrated } = useCart();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (!hydrated || lines.length === 0) return;
    let cancelled = false;
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("quote failed"))))
      .then((data: Quote) => {
        if (!cancelled) setQuote(data);
      })
      .catch(() => {
        if (!cancelled) setQuote(null);
      });
    return () => {
      cancelled = true;
    };
  }, [lines, hydrated]);

  if (!hydrated) {
    return <p className="mt-8 text-sm text-ink-soft">Φόρτωση καλαθιού…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-8 rounded-card border border-line bg-white p-12 text-center">
        <p className="font-display text-xl font-bold text-ink">Το καλάθι σου είναι άδειο.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Ας βρούμε κάτι που θα λατρέψει ο μικρός σου φίλος.
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

  const adjusted = quote?.lines.filter((l) => l.adjusted) ?? [];

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div>
        {adjusted.length > 0 && (
          <div role="alert" className="mb-4 rounded-card border border-tangerine/40 bg-tangerine/10 p-4 text-sm text-ink">
            Η ποσότητα κάποιων προϊόντων προσαρμόστηκε στο διαθέσιμο απόθεμα.
          </div>
        )}
        <ul className="divide-y divide-line rounded-card border border-line bg-white">
          {lines.map((line) => {
            const q = quote?.lines.find((l) => l.variantId === line.variantId);
            const img = productImageUrl(line.imagePath);
            const price = q?.price ?? line.price;
            const max = q?.maxQuantity ?? 99;
            return (
              <li key={line.variantId} className="flex gap-4 p-4">
                <Link
                  href={`/proion/${line.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card bg-sand"
                >
                  {img && <Image src={img} alt="" fill sizes="96px" className="object-cover" />}
                </Link>
                <div className="flex flex-1 flex-col">
                  <Link href={`/proion/${line.slug}`} className="text-sm font-semibold text-ink hover:text-forest">
                    {line.title}
                  </Link>
                  {line.variantTitle && (
                    <span className="text-xs text-ink-soft">{line.variantTitle}</span>
                  )}
                  {q?.outOfStock && (
                    <span className="mt-1 text-xs font-semibold text-tangerine-dark">
                      Εξαντλήθηκε
                    </span>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-1 rounded-full border border-line px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                        aria-label={`Μείωση ποσότητας: ${line.title}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-sand"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-bold">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.variantId, Math.min(max, line.quantity + 1))}
                        aria-label={`Αύξηση ποσότητας: ${line.title}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-ink hover:bg-sand"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.variantId)}
                      className="text-xs font-semibold text-ink-soft hover:text-tangerine"
                    >
                      Αφαίρεση
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display text-base font-bold text-ink">
                    {formatPrice(q?.lineTotal ?? price * line.quantity)}
                  </span>
                  {line.quantity > 1 && (
                    <p className="text-xs text-ink-soft">{formatPrice(price)} / τεμ.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="h-fit rounded-card border border-line bg-white p-5">
        <h2 className="font-display text-lg font-bold text-ink">Σύνοψη</h2>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Υποσύνολο</dt>
            <dd className="font-semibold">{formatPrice(quote?.subtotal ?? 0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Μεταφορικά</dt>
            <dd className="font-semibold">
              {quote?.shipping
                ? quote.shipping.cost === 0
                  ? "Δωρεάν"
                  : formatPrice(quote.shipping.cost)
                : "—"}
            </dd>
          </div>
          {quote?.shipping?.freeFrom && quote.shipping.cost > 0 && (
            <p className="text-xs text-forest">
              Δωρεάν μεταφορικά από {formatPrice(quote.shipping.freeFrom)} και πάνω.
            </p>
          )}
          {quote?.shippingError && (
            <p role="alert" className="text-xs font-semibold text-tangerine-dark">
              {quote.shippingError}
            </p>
          )}
          <div className="flex justify-between border-t border-line pt-3">
            <dt className="font-display text-base font-bold">Σύνολο</dt>
            <dd className="font-display text-base font-bold">
              {quote?.total === null || quote?.total === undefined
                ? "—"
                : formatPrice(quote.total)}
            </dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="mt-5 block rounded-full bg-tangerine px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
        >
          Ολοκλήρωση παραγγελίας
        </Link>
        <Link
          href="/katigoria/skylos"
          className="mt-3 block text-center text-sm font-semibold text-forest hover:underline"
        >
          Συνέχεια αγορών
        </Link>
      </aside>
    </div>
  );
}
