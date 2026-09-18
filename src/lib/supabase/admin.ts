import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — ΜΟΝΟ server-side (checkout, carts, newsletter).
 * Το create_order_v1 RPC εκτελείται αποκλειστικά από εδώ· τα EXECUTE
 * permissions στη βάση έχουν ανακληθεί από anon/authenticated/PUBLIC.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: "store" }, auth: { persistSession: false } },
  );
}
