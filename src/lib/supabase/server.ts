import { createClient } from "@supabase/supabase-js";

/**
 * Read-only client για το store schema με το anon key.
 * Χρησιμοποιείται από Server Components για catalog/CMS reads.
 *
 * Τα `!` θα περνούσαν `undefined` στο supabase-js, που πετάει «supabaseUrl is
 * required» — μήνυμα που δεν λέει σε ποιον τι λείπει. Ο ρητός έλεγχος κάνει
 * προφανές ότι δεν έχουν οριστεί οι μεταβλητές περιβάλλοντος.
 */
export function createStoreClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Λείπουν οι μεταβλητές NEXT_PUBLIC_SUPABASE_URL και NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Όρισέ τες στο .env.local τοπικά ή στις ρυθμίσεις του project στο Vercel.",
    );
  }
  return createClient(url, key, {
    db: { schema: "store" },
    auth: { persistSession: false },
  });
}
