"use client";

import { useRouter } from "next/navigation";
import { createClientAuth } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await createClientAuth().auth.signOut();
        router.refresh();
      }}
      className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-forest"
    >
      Αποσύνδεση
    </button>
  );
}
