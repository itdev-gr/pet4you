import Image from "next/image";
import type { ProductEditorial } from "@/lib/store/queries";
import { productImageUrl } from "@/lib/store/images";
import { Container } from "@/components/Section";

const FEATURE_ICONS: Record<string, string> = {
  leaf: "M4 20c0-8 6-14 16-15 1 10-5 16-13 16H4Zm2.5-2.5C10 14 13 11 16 9",
  sliders: "M4 8h10M18 8h2M4 16h4M12 16h8M16 6v4M8 14v4",
  clip: "M9 7h6a3 3 0 0 1 0 6H8a4 4 0 0 0 0 8h9M6 4v6M3 7h6",
  paw: "M12 19a4 4 0 0 0 4-4c0-2-2-3-4-3s-4 1-4 3a4 4 0 0 0 4 4ZM6 9a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 6 9Zm12 0a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 18 9ZM9.6 6.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm4.8 0a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z",
  shield: "M12 3 5 6v5.5c0 4.3 2.9 8.3 7 9.5 4.1-1.2 7-5.2 7-9.5V6Z",
  drop: "M12 3.5C9 7.5 6.5 10.5 6.5 13.5a5.5 5.5 0 0 0 11 0c0-3-2.5-6-5.5-10Z",
};

export function Editorial({ editorial }: { editorial: ProductEditorial }) {
  const img = productImageUrl(editorial.image);
  return (
    <Container as="section" className="mt-12">
      {/* Το κείμενο ξεκινά στην ίδια πάνω γραμμή με την εικόνα· η εικόνα
          γεμίζει το ύψος της σειράς ώστε να μην ανοίγει κενό από κάτω. */}
      <div className="grid items-stretch gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink lg:text-[2.1rem]">
            {editorial.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{editorial.body}</p>
          {editorial.features && editorial.features.length > 0 && (
            <ul className="mt-8 grid grid-cols-3 gap-4">
              {editorial.features.map((f) => (
                <li key={f.label} className="flex flex-col items-center gap-2.5 text-center">
                  <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-sand">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-forest" aria-hidden>
                      <path d={FEATURE_ICONS[f.icon] ?? FEATURE_ICONS.paw} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[0.8rem] font-semibold leading-snug text-ink">{f.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {img && (
          <div className="relative min-h-72 overflow-hidden rounded-card bg-sand max-lg:aspect-[1.07/1]">
            <Image
              src={img}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </Container>
  );
}
