/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog, getPartners } from "@/lib/store/queries";
import { contentImageUrl } from "@/lib/store/images";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Section";

export const metadata: Metadata = {
  title: "Brands",
  description: "Τα brands που εμπιστευόμαστε για τον καλύτερό σου φίλο.",
};
export const revalidate = 300;

export default async function BrandsPage() {
  const [partners, { products }] = await Promise.all([getPartners(), getCatalog({})]);

  const counts = new Map<string, number>();
  for (const p of products) {
    if (p.vendor) counts.set(p.vendor, (counts.get(p.vendor) ?? 0) + 1);
  }

  return (
    <div className="pb-16">
      <Breadcrumbs items={[{ label: "Brands" }]} />
      <Container>
        <h1 className="font-display text-[1.75rem] font-extrabold text-ink">
          Τα brands που αγαπάς, όλα εδώ.
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Επιλεγμένες μάρκες που εμπιστευόμαστε για την καθημερινή τους φροντίδα.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((p) => {
            const logo = contentImageUrl(p.logo_path);
            const count = counts.get(p.name) ?? 0;
            return (
              <Link
                key={p.id}
                href={`/anazitisi?q=${encodeURIComponent(p.name)}`}
                className="flex flex-col items-center gap-3 rounded-card border border-line bg-white p-6 transition-shadow hover:shadow-md"
              >
                {logo ? (
                  <img src={logo} alt={p.name} className="h-10 w-auto max-w-full" />
                ) : (
                  <span className="font-display text-base font-bold text-ink">{p.name}</span>
                )}
                {count > 0 && (
                  <span className="text-xs text-ink-soft">
                    {count} {count === 1 ? "προϊόν" : "προϊόντα"}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
