import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { quoteShipping, ShippingUnavailableError } from "@/lib/store/shipping";
import { fromCents, grossLineCents, mergeLines, toCents, vatRate } from "@/lib/store/vat";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PAYMENT_METHODS = new Set(["cod", "bank_transfer"]);

interface CheckoutItem {
  variantId: string;
  quantity: number;
}

interface CheckoutBody {
  idempotencyKey?: string;
  email?: string;
  phone?: string;
  note?: string;
  paymentMethod?: string;
  items?: CheckoutItem[];
  shippingAddress?: Record<string, string>;
}

/** Φιλικά ελληνικά μηνύματα για τα σφάλματα του RPC (match στο prefix). */
function friendlyError(message: string): string {
  if (message.startsWith("ORDER_INSUFFICIENT_STOCK")) {
    return "Κάποιο προϊόν δεν έχει επαρκές απόθεμα. Άλλαξε την ποσότητα και δοκίμασε ξανά.";
  }
  if (message.startsWith("ORDER_VARIANT_NOT_FOUND")) {
    return "Ένα προϊόν του καλαθιού δεν είναι πλέον διαθέσιμο.";
  }
  if (message.startsWith("ORDER_NO_ITEMS")) return "Το καλάθι σου είναι άδειο.";
  if (message.startsWith("ORDER_BAD_QUANTITY")) return "Μη έγκυρη ποσότητα.";
  if (message.startsWith("ORDER_EMAIL_OR_CUSTOMER")) return "Χρειαζόμαστε το email σου.";
  return "Δεν ήταν δυνατή η ολοκλήρωση της παραγγελίας. Δοκίμασε ξανά.";
}

const REQUIRED_ADDRESS_FIELDS = [
  "first_name",
  "last_name",
  "address1",
  "city",
  "postal_code",
] as const;

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Μη έγκυρο αίτημα." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Συμπλήρωσε ένα έγκυρο email." }, { status: 400 });
  }

  const paymentMethod = body.paymentMethod ?? "cod";
  if (!PAYMENT_METHODS.has(paymentMethod)) {
    return NextResponse.json({ error: "Μη έγκυρος τρόπος πληρωμής." }, { status: 400 });
  }

  const address = body.shippingAddress ?? {};
  for (const field of REQUIRED_ADDRESS_FIELDS) {
    if (!address[field] || address[field].trim() === "") {
      return NextResponse.json(
        { error: "Συμπλήρωσε όλα τα υποχρεωτικά πεδία της διεύθυνσης." },
        { status: 400 },
      );
    }
  }
  const countryCode = (address.country_code || "GR").toUpperCase();

  // Ενοποίηση ίδιων variants πριν τον υπολογισμό: δύο χωριστές γραμμές του ίδιου
  // προϊόντος στρογγυλοποιούν τον ΦΠΑ διαφορετικά από μία ενοποιημένη.
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
    return NextResponse.json({ error: "Το καλάθι σου είναι άδειο." }, { status: 400 });
  }

  const idempotencyKey =
    typeof body.idempotencyKey === "string" && UUID_RE.test(body.idempotencyKey)
      ? body.idempotencyKey
      : null;
  if (!idempotencyKey) {
    return NextResponse.json({ error: "Λείπει το κλειδί συναλλαγής." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // --- Idempotency: ένα cart ανά απόπειρα checkout, με μοναδικό visitor_token.
  // Αν έχει ήδη μετατραπεί σε παραγγελία, επιστρέφουμε την ίδια — χωρίς διπλή χρέωση.
  const { data: existingCart } = await supabase
    .from("carts")
    .select("id,converted_order_id")
    .eq("visitor_token", idempotencyKey)
    .maybeSingle();

  if (existingCart?.converted_order_id) {
    const { data: order } = await supabase
      .from("orders")
      .select("id,order_number,total")
      .eq("id", existingCart.converted_order_id)
      .maybeSingle();
    if (order) {
      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.order_number,
        total: Number(order.total),
        replayed: true,
      });
    }
  }

  let cartId = existingCart?.id ?? null;
  if (!cartId) {
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .insert({
        visitor_token: idempotencyKey,
        email,
        items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
        shipping_address: address,
      })
      .select("id")
      .single();
    if (cartError || !cart) {
      // Race: άλλο ταυτόχρονο αίτημα δημιούργησε το ίδιο cart — το ξαναδιαβάζουμε.
      const { data: raced } = await supabase
        .from("carts")
        .select("id,converted_order_id")
        .eq("visitor_token", idempotencyKey)
        .maybeSingle();
      if (raced?.converted_order_id) {
        return NextResponse.json({ error: "Η παραγγελία καταχωρήθηκε ήδη." }, { status: 409 });
      }
      if (!raced) {
        return NextResponse.json({ error: "Κάτι πήγε στραβά. Δοκίμασε ξανά." }, { status: 500 });
      }
      cartId = raced.id;
    } else {
      cartId = cart.id;
    }
  }

  // --- Authoritative υπολογισμός: τιμές και μεταφορικά από τη βάση.
  const { data: variants, error: variantError } = await supabase
    .from("product_variants")
    .select("id,price,products(tax_class)")
    .in(
      "id",
      items.map((i) => i.variantId),
    );
  if (variantError || !variants || variants.length !== new Set(items.map((i) => i.variantId)).size) {
    return NextResponse.json(
      { error: "Ένα προϊόν του καλαθιού δεν είναι πλέον διαθέσιμο." },
      { status: 400 },
    );
  }

  // Το κατώφλι δωρεάν μεταφορικών κρίνεται στη ΜΕΙΚΤΗ αξία εμπορευμάτων
  // (αυτό που βλέπει ο πελάτης), πριν από τα μεταφορικά.
  const grossSubtotalCents = items.reduce((sum, item) => {
    const v = variants.find((x) => x.id === item.variantId);
    const taxClass = (v?.products as unknown as { tax_class: string } | null)?.tax_class;
    return sum + grossLineCents(toCents(Number(v?.price ?? 0)), item.quantity, vatRate(taxClass));
  }, 0);

  let shipping;
  try {
    shipping = await quoteShipping(supabase, countryCode, grossSubtotalCents);
  } catch (e) {
    if (e instanceof ShippingUnavailableError) {
      return NextResponse.json(
        { error: "Δεν είναι δυνατή η αποστολή στη διεύθυνση που έδωσες. Επικοινώνησε μαζί μας." },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Κάτι πήγε στραβά. Δοκίμασε ξανά." }, { status: 500 });
  }

  const { data, error } = await supabase.rpc("create_order_v1", {
    payload: {
      email,
      phone: body.phone?.trim() || undefined,
      shipping_total: fromCents(shipping.costCents),
      discount_total: 0,
      shipping_address: address,
      billing_address: address,
      shipping_method: shipping.method,
      payment_method: paymentMethod,
      customer_note: body.note?.trim() || undefined,
      source: "web",
      status: "pending",
      items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      cart_id: cartId,
    },
  });

  if (error) {
    return NextResponse.json({ error: friendlyError(error.message) }, { status: 400 });
  }

  const result = data as {
    order_id: string;
    order_number: string;
    total: number;
    customer_id: string;
  };

  return NextResponse.json({
    orderId: result.order_id,
    orderNumber: result.order_number,
    total: Number(result.total),
    paymentMethod,
  });
}
