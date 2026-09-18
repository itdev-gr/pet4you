import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Auth client δεμένος στα cookies του request. Το `auth` schema του project
 * είναι ξεχωριστό από το `store` — εδώ μας ενδιαφέρει μόνο η ταυτότητα του
 * πελάτη· τα δεδομένα παραγγελιών διαβάζονται server-side με service_role,
 * φιλτραρισμένα στο email της συνεδρίας.
 */
export async function createAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Κλήση από Server Component — το middleware ανανεώνει τη συνεδρία.
          }
        },
      },
    },
  );
}

/** Ο συνδεδεμένος πελάτης, ή null. */
export async function getSessionUser() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
