"use client";

import { useState } from "react";
import { PawIcon } from "@/components/Logo";
import { Container } from "@/components/Section";

type Status = "idle" | "loading" | "success" | "error";

export function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!data.get("consent")) {
      setStatus("error");
      setMessage("Χρειάζεται η συγκατάθεσή σου για να εγγραφείς.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email") }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setMessage("Ευχαριστούμε! Θα τα λέμε στο inbox σου. 🐾");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Κάτι πήγε στραβά — δοκίμασε ξανά σε λίγο.");
    }
  }

  return (
    <Container as="section">
      <div className="relative overflow-hidden rounded-tile bg-sunshine px-8 py-11">
        <PawIcon className="absolute -left-3 top-5 h-20 w-20 rotate-12 text-tangerine-bright/40" />
        <PawIcon className="absolute -right-2 bottom-4 h-16 w-16 -rotate-12 text-tangerine-bright/40" />
        <PawIcon className="absolute left-24 -bottom-3 hidden h-12 w-12 rotate-45 text-tangerine-bright/30 sm:block" />
        <div className="relative grid items-center gap-6 md:grid-cols-2">
          <h2 className="font-display text-[1.75rem] font-extrabold leading-tight text-ink lg:text-[2rem]">
            Λίγη περισσότερη
            <br />
            χαρά στο inbox σου.
          </h2>
          <div>
            <p className="text-sm text-ink/75">
              Νέα προϊόντα, προσφορές και χρήσιμες συμβουλές για μια καλύτερη ζωή μαζί.
            </p>
            <form onSubmit={onSubmit} className="mt-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Το email σου"
                  aria-label="Το email σου"
                  className="w-full rounded-full border border-ink/10 bg-white px-5 py-3 text-sm outline-none focus:border-forest"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="shrink-0 rounded-full bg-tangerine px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark disabled:opacity-60"
                >
                  {status === "loading" ? "…" : "Εγγραφή"}
                </button>
              </div>
              <label className="mt-2.5 flex items-start gap-2 text-xs text-ink/70">
                <input type="checkbox" name="consent" className="mt-0.5 accent-forest" />
                Θέλω να λαμβάνω νέα, προσφορές και χρήσιμες συμβουλές από το pet shop.
              </label>
              {message && (
                <p
                  role="status"
                  className={`mt-2 text-sm font-semibold ${
                    status === "success" ? "text-forest" : "text-tangerine-dark"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}
