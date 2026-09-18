/**
 * ΦΠΑ — αριθμητική σε ακέραια λεπτά.
 *
 * Το `store.product_variants.price` είναι **καθαρή τιμή** (προ ΦΠΑ) — το
 * `create_order_v1` υπολογίζει και προσθέτει τον ΦΠΑ ανά γραμμή με βάση το
 * `products.tax_class`. Ο ελληνικός νόμος απαιτεί λιανικές τιμές με ΦΠΑ, οπότε
 * το storefront εμφανίζει πάντα τη μεικτή τιμή.
 *
 * Ο υπολογισμός γίνεται σε ακέραια λεπτά, επειδή το `Math.round` πάνω σε
 * δεκαδικά floats δεν συμπίπτει με το `round(numeric, 2)` της Postgres:
 * π.χ. net 2,75 με 6% δίνει φόρο 0,165 → η Postgres στρογγυλοποιεί στα 0,17,
 * ενώ `Math.round(2.75 * 0.06 * 100) / 100` δίνει 0,16 λόγω δυαδικής
 * αναπαράστασης. Μια απόκλιση ενός λεπτού ανάμεσα σε καλάθι και παραγγελία
 * είναι ορατή στον πελάτη, γι' αυτό ο τύπος εδώ αναπαράγει ακριβώς τον RPC.
 */

export type TaxClass = "standard" | "reduced" | "super_reduced";

export function vatRate(taxClass: string | null | undefined): number {
  switch (taxClass) {
    case "super_reduced":
      return 6;
    case "reduced":
      return 13;
    default:
      return 24;
  }
}

/** Δεκαδική τιμή σε ακέραια λεπτά, χωρίς σφάλμα δυαδικής αναπαράστασης. */
export function toCents(amount: number): number {
  return Math.round(amount * 100 + (amount >= 0 ? Number.EPSILON : -Number.EPSILON) * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

/**
 * ΦΠΑ γραμμής σε λεπτά — half-up, όπως το `round(numeric, 2)` της Postgres.
 * Ισχύει για μη αρνητικά ποσά και τους ακέραιους συντελεστές του συμβολαίου.
 */
export function taxCents(netLineCents: number, rate: number): number {
  return Math.floor((netLineCents * rate + 50) / 100);
}

/** Μεικτό σύνολο γραμμής σε λεπτά — ίδιος τύπος με το create_order_v1. */
export function grossLineCents(
  netUnitCents: number,
  quantity: number,
  rate: number,
): number {
  const netLine = netUnitCents * quantity;
  return netLine + taxCents(netLine, rate);
}

/** Μεικτή τιμή μονάδας — για εμφάνιση (π.χ. «22,90 €»). */
export function grossUnit(net: number, rate: number): number {
  return fromCents(grossLineCents(toCents(net), 1, rate));
}

/** Μεικτό σύνολο γραμμής, σε ευρώ. */
export function grossLine(net: number, quantity: number, rate: number): number {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error(`Μη έγκυρη ποσότητα: ${quantity}`);
  }
  return fromCents(grossLineCents(toCents(net), quantity, rate));
}

/**
 * Ενοποιεί γραμμές με το ίδιο variant πριν τον υπολογισμό — αλλιώς δύο
 * χωριστές γραμμές του ίδιου προϊόντος στρογγυλοποιούν διαφορετικά από μία
 * ενοποιημένη, και το καλάθι αποκλίνει από την παραγγελία.
 */
export function mergeLines<T extends { variantId: string; quantity: number }>(
  lines: T[],
): T[] {
  const byVariant = new Map<string, T>();
  for (const line of lines) {
    const existing = byVariant.get(line.variantId);
    if (existing) existing.quantity += line.quantity;
    else byVariant.set(line.variantId, { ...line });
  }
  return [...byVariant.values()];
}
