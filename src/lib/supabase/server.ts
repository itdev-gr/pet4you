import { createClient } from "@supabase/supabase-js";

/**
 * Read-only client για το store schema με το anon key.
 * Χρησιμοποιείται από Server Components για catalog/CMS reads.
 */
export function createStoreClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "store" }, auth: { persistSession: false } },
  );
}
