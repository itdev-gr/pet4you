import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Section";
import { AuthForm } from "./AuthForm";
import { SignOutButton } from "./SignOutButton";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Ο λογαριασμός μου" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  pending: "Σε αναμονή",
  paid: "Πληρωμένη",
  processing: "Σε επεξεργασία",
  shipped: "Απεστάλη",
  delivered: "Παραδόθηκε",
  completed: "Ολοκληρώθηκε",
  cancelled: "Ακυρώθηκε",
  refunded: "Επιστροφή χρημάτων",
  on_hold: "Σε αναμονή",
};

export default async function AccountPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="pb-16">
        <Breadcrumbs items={[{ label: "Ο λογαριασμός μου" }]} />
        <Container>
          <h1 className="text-center font-display text-[1.75rem] font-extrabold text-ink">
            Ο λογαριασμός μου
          </h1>
          <AuthForm />
        </Container>
      </div>
    );
  }

  // Οι παραγγελίες διαβάζονται server-side με service_role, φιλτραρισμένες
  // αυστηρά στο email της επαληθευμένης συνεδρίας.
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id,order_number,status,total,currency,created_at,payment_method")
    .eq("email", user.email)
    .order("created_at", { ascending: false })
    .limit(25);

  const meta = user.user_metadata as { first_name?: string; last_name?: string };
  const name = [meta?.first_name, meta?.last_name].filter(Boolean).join(" ");

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: "Ο λογαριασμός μου" }]} />
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-[1.75rem] font-extrabold text-ink">
              Γεια σου{name ? `, ${name}` : ""}!
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-ink">Οι παραγγελίες μου</h2>
          {!orders || orders.length === 0 ? (
            <div className="mt-4 rounded-card border border-line bg-white p-10 text-center">
              <p className="font-display text-lg font-bold text-ink">Δεν έχεις παραγγελίες ακόμα.</p>
              <p className="mt-1.5 text-sm text-ink-soft">
                Όταν κάνεις την πρώτη σου παραγγελία, θα την βρεις εδώ.
              </p>
              <Link
                href="/katigoria/skylos"
                className="mt-5 inline-block rounded-full bg-tangerine px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
              >
                Δες τα προϊόντα
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <span className="font-display text-base font-bold text-ink">
                      {o.order_number}
                    </span>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {new Date(o.created_at).toLocaleDateString("el-GR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" · "}
                      {o.payment_method === "bank_transfer" ? "Τραπεζική κατάθεση" : "Αντικαταβολή"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-forest">
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                    <span className="font-display text-base font-bold text-ink">
                      {formatPrice(Number(o.total))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </div>
  );
}
