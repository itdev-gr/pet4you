"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientAuth } from "@/lib/supabase/browser";

type Mode = "login" | "register";

const ERRORS: Record<string, string> = {
  "Invalid login credentials": "Λάθος email ή κωδικός.",
  "User already registered": "Υπάρχει ήδη λογαριασμός με αυτό το email.",
  "Password should be at least 6 characters.":
    "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.",
};

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const supabase = createClientAuth();

    const { error: authError } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: String(form.get("first_name") ?? "").trim(),
                last_name: String(form.get("last_name") ?? "").trim(),
              },
            },
          });

    setBusy(false);
    if (authError) {
      setError(ERRORS[authError.message] ?? "Κάτι πήγε στραβά. Δοκίμασε ξανά.");
      return;
    }
    if (mode === "register") {
      setInfo("Σου στείλαμε email επιβεβαίωσης. Έλεγξε τα εισερχόμενά σου.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-card border border-line bg-white p-7">
      <div className="flex gap-2" role="tablist" aria-label="Σύνδεση ή εγγραφή">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setError(null);
              setInfo(null);
            }}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              mode === m ? "bg-forest text-white" : "bg-sand text-ink hover:bg-sage-soft"
            }`}
          >
            {m === "login" ? "Σύνδεση" : "Εγγραφή"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "register" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Όνομα</span>
              <input
                name="first_name"
                autoComplete="given-name"
                className="rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-ink">Επώνυμο</span>
              <input
                name="last_name"
                autoComplete="family-name"
                className="rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
              />
            </label>
          </div>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Κωδικός</span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="rounded-card border border-line px-3.5 py-2.5 text-sm outline-none focus:border-forest"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-card bg-tangerine/10 p-3 text-sm font-semibold text-tangerine-dark">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="rounded-card bg-sage-soft p-3 text-sm font-semibold text-forest">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark disabled:opacity-60"
        >
          {busy ? "…" : mode === "login" ? "Σύνδεση" : "Δημιουργία λογαριασμού"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-soft">
        Μπορείς να παραγγείλεις και χωρίς λογαριασμό, ως επισκέπτης.
      </p>
    </div>
  );
}
