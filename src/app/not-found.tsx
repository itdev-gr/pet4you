import Link from "next/link";
import { PawIcon } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sunshine">
        <PawIcon className="h-8 w-8 text-tangerine" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">
        Ουπς! Χαθήκαμε λίγο.
      </h1>
      <p className="mt-2 text-ink-soft">
        Η σελίδα που ψάχνεις δεν υπάρχει — ή μετακόμισε σε άλλη φωλιά.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
        >
          Πάμε στην αρχική
        </Link>
        <Link
          href="/anazitisi"
          className="rounded-full border border-line bg-white px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-forest"
        >
          Αναζήτηση προϊόντων
        </Link>
      </div>
    </div>
  );
}
