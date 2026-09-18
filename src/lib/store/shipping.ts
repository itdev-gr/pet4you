import type { createAdminClient } from "@/lib/supabase/admin";
import { toCents } from "./vat";

type StoreClient = ReturnType<typeof createAdminClient>;

export interface ShippingQuote {
  method: string;
  label: string;
  /** Κόστος σε λεπτά. */
  costCents: number;
  /** Κατώφλι δωρεάν μεταφορικών σε λεπτά, ή null αν δεν ισχύει. */
  freeFromCents: number | null;
}

export class ShippingUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShippingUnavailableError";
  }
}

/**
 * Υπολογίζει τα μεταφορικά από store.shipping_zones / shipping_rates.
 *
 * Καλείται πάντα server-side — ο πελάτης δεν στέλνει ποτέ κόστος αποστολής.
 * Ένα σφάλμα ή μια χώρα χωρίς ζώνη ΔΕΝ γίνεται σιωπηλά «δωρεάν»: πετάει, ώστε
 * το checkout να σταματήσει αντί να χρεώσει λάθος ποσό. Δωρεάν σημαίνει μόνο
 * πραγματικά ρυθμισμένο μηδενικό κόστος ή κατώφλι που καλύφθηκε.
 */
export async function quoteShipping(
  supabase: StoreClient,
  countryCode: string,
  grossSubtotalCents: number,
): Promise<ShippingQuote> {
  const { data: zones, error: zoneError } = await supabase
    .from("shipping_zones")
    .select("id,name,country_codes,position")
    .order("position");
  if (zoneError) {
    throw new ShippingUnavailableError(`shipping_zones: ${zoneError.message}`);
  }

  const zone = (zones ?? []).find((z) =>
    (z.country_codes ?? []).includes(countryCode),
  );
  if (!zone) {
    throw new ShippingUnavailableError(
      `Δεν υπάρχει ζώνη αποστολής για τη χώρα ${countryCode}.`,
    );
  }

  const { data: rates, error: rateError } = await supabase
    .from("shipping_rates")
    .select("id,name,carrier,rate_type,price,modifier_value")
    .eq("zone_id", zone.id)
    .eq("active", true)
    .order("position")
    .limit(1);
  if (rateError) {
    throw new ShippingUnavailableError(`shipping_rates: ${rateError.message}`);
  }

  const rate = (rates ?? [])[0];
  if (!rate) {
    throw new ShippingUnavailableError(
      `Δεν έχει οριστεί τρόπος αποστολής για τη ζώνη «${zone.name}».`,
    );
  }

  const priceCents = toCents(Number(rate.price));
  const thresholdCents =
    rate.rate_type === "by_cart_value" && rate.modifier_value !== null
      ? toCents(Number(rate.modifier_value))
      : null;

  const costCents =
    thresholdCents !== null && grossSubtotalCents >= thresholdCents ? 0 : priceCents;

  return {
    method: rate.carrier ? `${rate.carrier}_standard` : "standard",
    label: rate.name,
    costCents,
    freeFromCents: thresholdCents,
  };
}
