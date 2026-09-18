import type { Metadata } from "next";
import { Container } from "@/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Το καλάθι μου" };

export default function CartPage() {
  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: "Το καλάθι μου" }]} />
      <Container>
        <h1 className="font-display text-3xl font-extrabold text-ink">Το καλάθι μου</h1>
        <CartView />
      </Container>
    </div>
  );
}
