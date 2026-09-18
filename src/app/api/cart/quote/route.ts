import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { quoteShipping, ShippingUnavailableError } from "@/lib/store/shipping";
import { fromCents, grossLineCents, mergeLines, toCents, vatRate } from "@/lib/store/vat";

export const dynamic = "force-dynamic";

interface QuoteItem {
  variantId: string;
  quantity: number;
}

const EMPTY_SHIPPING = {
  method: "standard",
  label: "Παράδοση με courier",
  cost: 0,
  freeFrom: null as number | null,
};

/**
 * Authoritative τιμολόγηση καλαθιού: τιμές, ΦΠΑ, απόθεμα και μεταφορικά
 * υπολογίζονται πάντα από τη βάση, ποτέ από το payload του browser.
 * Το αποτέλεσμα πρέπει να συμφωνεί στο λεπτό με το /api/checkout.
 */
export async function POST(req: Request) {
  let body: { items?: QuoteItem[]; countryCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const items = mergeLines(
    (body.items ?? []).filter(
      (i) =>
        typeof i?.variantId === "string" &&
        Number.isInteger(i?.quantity) &&
        i.quantity > 0 &&
        i.quantity <= 999,
    ),
  );
  if (items.length === 0) {
    return NextResponse.json({ lines: [], subtotal: 0, shipping: EMPTY_SHIPPING, total: 0 });
  }

  // Server-only client: τα shipping_zones/rates δεν είναι αναγνώσιμα με anon key,
  // και το quote πρέπει να συμφωνεί ακριβώς με ό,τι χρεώνει το /api/checkout.
  const supabase = createAdminClient();
  const { data: variants, error } = await supabase
    .from("product_variants")
    .select(
      "id,title,price,inventory_quantity,inventory_policy,products(title,slug,tax_class,product_images(storage_path,position))",
    )
    .in(
      "id",
      items.map((i) => i.variantId),
    );
  if (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const lines = items.flatMap((item) => {
    const v = (variants ?? []).find((x) => x.id === item.variantId);
    if (!v) return [];
    const product = v.products as unknown as {
      title: string;
      slug: string;
      tax_class: string;
      product_images: { storage_path: string; position: number }[];
    };
    const available =
      v.inventory_policy === "continue"
        ? item.quantity
        : Math.min(item.quantity, v.inventory_quantity);
    const quantity = Math.max(available, 0);
    const image = [...(product?.product_images ?? [])].sort(
      (a, b) => a.position - b.position,
    )[0];
    const rate = vatRate(product?.tax_class);
    const netUnitCents = toCents(Number(v.price));
    return [
      {
        variantId: v.id,
        title: product?.title ?? "",
        slug: product?.slug ?? "",
        variantTitle: v.title,
        /** Μεικτή τιμή μονάδας (με ΦΠΑ) για εμφάνιση. */
        price: fromCents(grossLineCents(netUnitCents, 1, rate)),
        /** Μεικτό σύνολο γραμμής — ίδιος τύπος με το create_order_v1. */
        lineTotal: fromCents(grossLineCents(netUnitCents, quantity, rate)),
        vatRate: rate,
        requestedQuantity: item.quantity,
        quantity,
        maxQuantity: v.inventory_policy === "continue" ? 999 : v.inventory_quantity,
        adjusted: available !== item.quantity,
        outOfStock: available <= 0,
        imagePath: image?.storage_path ?? null,
      },
    ];
  });

  const subtotalCents = lines.reduce((sum, l) => sum + toCents(l.lineTotal), 0);

  try {
    const shipping = await quoteShipping(supabase, body.countryCode ?? "GR", subtotalCents);
    return NextResponse.json({
      lines,
      subtotal: fromCents(subtotalCents),
      shipping: {
        method: shipping.method,
        label: shipping.label,
        cost: fromCents(shipping.costCents),
        freeFrom: shipping.freeFromCents === null ? null : fromCents(shipping.freeFromCents),
      },
      total: fromCents(subtotalCents + shipping.costCents),
    });
  } catch (e) {
    if (e instanceof ShippingUnavailableError) {
      return NextResponse.json(
        {
          lines,
          subtotal: fromCents(subtotalCents),
          shipping: null,
          total: null,
          shippingError: "Δεν μπορούμε να υπολογίσουμε μεταφορικά αυτή τη στιγμή.",
        },
        { status: 200 },
      );
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
