"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/format";

interface Quote {
  subtotal: number;
  shipping: { label: string; cost: number; freeFrom: number | null } | null;
  total: number | null;
  lines: { variantId: string; quantity: number; outOfStock: boolean }[];
  shippingError?: string;
}

const FIELDS = [
  { name: "first_name", label: "Όνομα", required: true, autoComplete: "given-name" },
  { name: "last_name", label: "Επώνυμο", required: true, autoComplete: "family-name" },
  { name: "address1", label: "Διεύθυνση", required: true, autoComplete: "address-line1", full: true },
  { name: "address2", label: "Όροφος / κουδούνι", required: false, autoComplete: "address-line2", full: true },
  { name: "city", label: "Πόλη", required: true, autoComplete: "address-level2" },
  { name: "postal_code", label: "Τ.Κ.", required: true, autoComplete: "postal-code" },
] as const;

export function CheckoutForm({
  defaultEmail = "",
  defaultFirstName = "",
  defaultLastName = "",
}: {
  defaultEmail?: string;
  defaultFirstName?: string;
  defaultLastName?: string;
}) {
  const { lines, subtotal, clear, hydrated } = useCart();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<"cod" | "bank_transfer">("cod");

  /**
   * Σταθερό κλειδί ανά απόπειρα checkout — προστασία από διπλή παραγγελία.
   * Δημιουργείται στο πρώτο submit (όχι στο render, που πρέπει να είναι καθαρό)
   * και επαναχρησιμοποιείται σε κάθε retry της ίδιας απόπειρας.
   */
  const idempotencyKeyRef = useRef<string | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!hydrated || lines.length === 0) return;
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
      }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [lines, hydrated]);

  if (hydrated && lines.length === 0) {
    return (
      <div className="mt-8 rounded-card border border-line bg-white p-12 text-center">
        <p className="font-display text-xl font-bold text-ink">Το καλάθι σου είναι άδειο.</p>
        <Link
          href="/katigoria/skylos"
          className="mt-5 inline-block rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
        >
          Δες τα προϊόντα
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittedRef.current || submitting) return;
    submittedRef.current = true;
    setSubmitting(true);
    setError(null);
    idempotencyKeyRef.current ??=
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    const form = new FormData(e.currentTarget);
    const address: Record<string, string> = { country_code: "GR" };
    for (const field of FIELDS) {
      address[field.name] = String(form.get(field.name) ?? "").trim();
    }
    address.phone = String(form.get("phone") ?? "").trim();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: idempotencyKeyRef.current,
          email: form.get("email"),
          phone: address.phone,
          note: form.get("note"),
          paymentMethod: payment,
          shippingAddress: address,
          items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Κάτι πήγε στραβά. Δοκίμασε ξανά.");
        submittedRef.current = false;
        setSubmitting(false);
        return;
      }
      clear();
      router.push(
        `/paraggelia/epitixia?number=${encodeURIComponent(data.orderNumber)}&total=${data.total}&payment=${payment}`,
      );
    } catch {
      setError("Πρόβλημα σύνδεσης. Δοκίμασε ξανά.");
      submittedRef.current = false;
      setSubmitting(false);
    }
  }

  const displayTotal = quote?.total ?? null;
  const canSubmit = !submitting && (quote === null || quote.total !== null);

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <fieldset className="rounded-card border border-line bg-white p-5">
          <legend className="px-1 font-display text-lg font-bold text-ink">Στοιχεία επικοινωνίας</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-ink">
                Email <span className="text-tangerine">*</span>
              </span>
              <input
                type="email"
                name="email"
                required
                defaultValue={defaultEmail}
                autoComplete="email"
                className="rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Τηλέφωνο</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                className="rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-card border border-line bg-white p-5">
          <legend className="px-1 font-display text-lg font-bold text-ink">Διεύθυνση αποστολής</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label
                key={f.name}
                className={`flex flex-col gap-1.5 ${"full" in f && f.full ? "sm:col-span-2" : ""}`}
              >
                <span className="text-sm font-semibold text-ink">
                  {f.label} {f.required && <span className="text-tangerine">*</span>}
                </span>
                <input
                  type="text"
                  name={f.name}
                  required={f.required}
                  defaultValue={
                    f.name === "first_name"
                      ? defaultFirstName
                      : f.name === "last_name"
                        ? defaultLastName
                        : undefined
                  }
                  autoComplete={f.autoComplete}
                  className="rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
                />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-card border border-line bg-white p-5">
          <legend className="px-1 font-display text-lg font-bold text-ink">Τρόπος πληρωμής</legend>
          <div className="mt-3 space-y-2.5">
            {[
              { id: "cod", label: "Αντικαταβολή", hint: "Πληρώνεις με την παράδοση στον courier." },
              {
                id: "bank_transfer",
                label: "Τραπεζική κατάθεση",
                hint: "Θα λάβεις τα στοιχεία λογαριασμού με email.",
              },
            ].map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors ${
                  payment === m.id ? "border-forest bg-sage-soft/40" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={payment === m.id}
                  onChange={() => setPayment(m.id as "cod" | "bank_transfer")}
                  className="mt-0.5 accent-forest"
                />
                <span>
                  <span className="block text-sm font-bold text-ink">{m.label}</span>
                  <span className="block text-xs text-ink-soft">{m.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-card border border-line bg-white p-5">
          <legend className="px-1 font-display text-lg font-bold text-ink">Σχόλια παραγγελίας</legend>
          <textarea
            name="note"
            rows={3}
            placeholder="Οδηγίες παράδοσης, ώρα παραλαβής…"
            className="mt-3 w-full rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
          />
        </fieldset>
      </div>

      <aside className="h-fit rounded-card border border-line bg-white p-5 lg:sticky lg:top-4">
        <h2 className="font-display text-lg font-bold text-ink">Η παραγγελία σου</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.variantId} className="flex justify-between gap-3">
              <span className="text-ink-soft">
                {l.title}
                {l.variantTitle ? ` · ${l.variantTitle}` : ""} × {l.quantity}
              </span>
              <span className="shrink-0 font-semibold">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Υποσύνολο</dt>
            <dd className="font-semibold">{formatPrice(quote?.subtotal ?? subtotal)}</dd>
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
          <div className="flex justify-between border-t border-line pt-3">
            <dt className="font-display text-base font-bold">Σύνολο</dt>
            <dd className="font-display text-base font-bold">
              {displayTotal === null ? "—" : formatPrice(displayTotal)}
            </dd>
          </div>
        </dl>

        {quote?.shippingError && (
          <p role="alert" className="mt-4 rounded-card bg-tangerine/10 p-3 text-sm font-semibold text-tangerine-dark">
            {quote.shippingError}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-card bg-tangerine/10 p-3 text-sm font-semibold text-tangerine-dark">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-5 w-full rounded-full bg-tangerine px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Καταχώρηση…" : "Ολοκλήρωση παραγγελίας"}
        </button>
        <p className="mt-3 text-xs text-ink-soft">
          Με την ολοκλήρωση αποδέχεσαι τους{" "}
          <Link href="/selida/oroi-xrisis" className="text-forest underline">
            όρους χρήσης
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}
