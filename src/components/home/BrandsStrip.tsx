/* eslint-disable @next/next/no-img-element */
import type { Partner } from "@/lib/store/types";
import { contentImageUrl } from "@/lib/store/images";
import { Container, SectionHeading } from "@/components/Section";

export function BrandsStrip({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  return (
    <Container as="section">
      <SectionHeading title="Τα brands που αγαπάς, όλα εδώ." />
      {/* Χωρίς λευκό κουτί: τα σήματα κάθονται ελεύθερα στο κοινό background. */}
      <div className="mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-8 sm:grid-cols-6">
        {partners.map((p) => {
          const logo = contentImageUrl(p.logo_path);
          return (
            <div key={p.id} className="flex items-center justify-center">
              {logo ? (
                /* SVG λογότυπα: απλό <img> — το next/image δεν βελτιστοποιεί svg */
                <img src={logo} alt={p.name} className="max-h-9 w-auto max-w-full opacity-85" />
              ) : (
                <span className="font-display text-sm font-bold text-ink">{p.name}</span>
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
