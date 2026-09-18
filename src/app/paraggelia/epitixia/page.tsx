import type { Metadata } from "next";
import Link from "next/link";
import { PawIcon } from "@/components/Logo";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Η παραγγελία σου καταχωρήθηκε" };

type SearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const orderNumber = one(sp.number);
  const total = Number(one(sp.total) ?? 0);
  const payment = one(sp.payment);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-soft">
        <PawIcon className="h-8 w-8 text-forest" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">
        Ευχαριστούμε για την παραγγελία σου!
      </h1>
      {orderNumber && (
        <p className="mt-2 text-ink-soft">
          Ο αριθμός παραγγελίας σου είναι{" "}
          <strong className="font-bold text-ink">{orderNumber}</strong>.
        </p>
      )}
      {total > 0 && (
        <p className="mt-1 text-ink-soft">
          Σύνολο: <strong className="font-bold text-ink">{formatPrice(total)}</strong>
        </p>
      )}

      <div className="mt-6 rounded-card border border-line bg-white p-6 text-left">
        <h2 className="font-display text-lg font-bold text-ink">Τι ακολουθεί;</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li>• Θα λάβεις email επιβεβαίωσης με τα στοιχεία της παραγγελίας.</li>
          {payment === "bank_transfer" ? (
            <li>
              • Θα σου στείλουμε τα στοιχεία τραπεζικού λογαριασμού. Η αποστολή ξεκινά μόλις
              επιβεβαιωθεί η κατάθεση.
            </li>
          ) : (
            <li>• Πληρώνεις με αντικαταβολή κατά την παράδοση στον courier.</li>
          )}
          <li>• Παράδοση σε 1–3 εργάσιμες ημέρες με courier.</li>
        </ul>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
        >
          Επιστροφή στην αρχική
        </Link>
        <Link
          href="/logariasmos"
          className="rounded-full border-2 border-ink/60 px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink"
        >
          Οι παραγγελίες μου
        </Link>
      </div>
    </div>
  );
}
