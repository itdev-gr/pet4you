"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PawIcon } from "@/components/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand">
        <PawIcon className="h-8 w-8 text-ink-soft" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
        Κάτι πήγε στραβά.
      </h1>
      <p className="mt-2 text-ink-soft">
        Δοκίμασε ξανά σε λίγο — αν το πρόβλημα επιμείνει, επικοινώνησε μαζί μας.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
        >
          Δοκίμασε ξανά
        </button>
        <Link
          href="/"
          className="rounded-full border border-line bg-white px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-forest"
        >
          Αρχική σελίδα
        </Link>
      </div>
    </div>
  );
}
