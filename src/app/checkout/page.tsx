import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Section";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getSessionUser } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Ολοκλήρωση παραγγελίας" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // Για συνδεδεμένους πελάτες προσυμπληρώνουμε το email — έτσι η παραγγελία
  // συνδέεται με τον λογαριασμό τους (το RPC ταιριάζει τον πελάτη στο email).
  const user = await getSessionUser();
  const meta = user?.user_metadata as
    | { first_name?: string; last_name?: string }
    | undefined;

  return (
    <div className="pb-16">
      <Breadcrumbs
        items={[{ label: "Το καλάθι μου", href: "/kalathi" }, { label: "Ολοκλήρωση" }]}
      />
      <Container>
        <h1 className="font-display text-[1.75rem] font-extrabold text-ink">
          Ολοκλήρωση παραγγελίας
        </h1>
        <CheckoutForm
          defaultEmail={user?.email ?? ""}
          defaultFirstName={meta?.first_name ?? ""}
          defaultLastName={meta?.last_name ?? ""}
        />
      </Container>
    </div>
  );
}
