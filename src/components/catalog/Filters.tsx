"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@/lib/store/types";

/** Φίλτρα καταλόγου — η κατάσταση ζει στο URL ώστε να μοιράζεται και να γυρνά πίσω. */
export function Filters({
  vendors,
  priceRange,
  subcategories,
}: {
  vendors: string[];
  priceRange: { min: number; max: number };
  subcategories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      const current = next.get(key)?.split(",").filter(Boolean) ?? [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length === 0) next.delete(key);
      else next.set(key, updated.join(","));
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const selectedVendors = params.get("vendor")?.split(",").filter(Boolean) ?? [];
  const inStock = params.get("stock") === "1";
  const hasFilters = ["vendor", "min", "max", "stock", "sort"].some((k) => params.get(k));

  return (
    <aside className="lg:w-60 lg:shrink-0">
      <div className="space-y-6 rounded-card border border-line bg-white p-5">
        {subcategories.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-ink">Κατηγορίες</h3>
            <ul className="mt-2.5 space-y-1.5">
              {subcategories.map((c) => (
                <li key={c.id}>
                  <a
                    href={`/katigoria/${c.slug}`}
                    className="text-sm text-ink-soft transition-colors hover:text-forest"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {vendors.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-ink">Brand</h3>
            <ul className="mt-2.5 space-y-1.5">
              {vendors.map((v) => (
                <li key={v}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(v)}
                      onChange={() => toggleMulti("vendor", v)}
                      className="accent-forest"
                    />
                    {v}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {priceRange.max > priceRange.min && (
          <div>
            <h3 className="text-sm font-bold text-ink">Τιμή (€)</h3>
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={priceRange.min}
                max={priceRange.max}
                defaultValue={params.get("min") ?? ""}
                placeholder={String(priceRange.min)}
                aria-label="Ελάχιστη τιμή"
                onBlur={(e) => update("min", e.target.value)}
                className="w-full rounded-card border border-line px-2.5 py-1.5 text-sm outline-none focus:border-forest"
              />
              <span aria-hidden className="text-ink-soft">
                –
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={priceRange.min}
                max={priceRange.max}
                defaultValue={params.get("max") ?? ""}
                placeholder={String(priceRange.max)}
                aria-label="Μέγιστη τιμή"
                onBlur={(e) => update("max", e.target.value)}
                className="w-full rounded-card border border-line px-2.5 py-1.5 text-sm outline-none focus:border-forest"
              />
            </div>
          </div>
        )}

        <div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={inStock}
              onChange={() => update("stock", inStock ? null : "1")}
              className="accent-forest"
            />
            Μόνο διαθέσιμα
          </label>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-sm font-bold text-tangerine hover:underline"
          >
            Καθαρισμός φίλτρων
          </button>
        )}
      </div>
    </aside>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <label className="flex items-center gap-2 text-sm text-ink-soft">
      Ταξινόμηση
      <select
        value={params.get("sort") ?? ""}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value) next.set("sort", e.target.value);
          else next.delete("sort");
          router.push(`${pathname}?${next.toString()}`, { scroll: false });
        }}
        className="rounded-card border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink outline-none focus:border-forest"
      >
        <option value="">Προτεινόμενα</option>
        <option value="newest">Νεότερα πρώτα</option>
        <option value="price_asc">Τιμή: χαμηλή → υψηλή</option>
        <option value="price_desc">Τιμή: υψηλή → χαμηλή</option>
        <option value="name">Αλφαβητικά</option>
      </select>
    </label>
  );
}
