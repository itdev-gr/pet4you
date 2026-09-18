import Image from "next/image";
import Link from "next/link";
import type { HeroSlide } from "@/lib/store/types";
import { contentImageUrl } from "@/lib/store/images";
import { Container } from "@/components/Section";

const USPS = [
  {
    label: "Παράδοση στο σπίτι",
    path: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  },
  {
    label: "Επιλεγμένα brands",
    path: "m12 3 8 4v10l-8 4-8-4V7Zm0 0v18M4 7l8 4 8-4",
  },
  {
    label: "Φροντίδα κάθε μέρα",
    path: "M12 20.3 4.9 13a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5Z",
  },
];

/** Hero full-bleed αμέσως κάτω από το nav, με τη λωρίδα USP να εφάπτεται. */
export function Hero({ slide }: { slide: HeroSlide | undefined }) {
  if (!slide) return null;
  const img = contentImageUrl(slide.image_path);
  const [headingA, headingB] = splitHeading(slide.heading ?? "");

  return (
    <>
      {/* Η φωτογραφία φτάνει ως την άκρη του viewport στο desktop, όπως το
          mockup· στο mobile πέφτει κάτω από το κείμενο με κανονική ροή. */}
      <section className="relative overflow-hidden bg-sunshine">
        <Container className="grid items-center gap-6 md:grid-cols-[1.05fr_1fr]">
          <div className="relative z-10 py-12 md:py-16">
            <h1 className="font-display text-[2.75rem] font-extrabold leading-[1.05] text-ink sm:text-[3.5rem] lg:text-[4.25rem]">
              {headingA}
              {headingB && (
                <>
                  <br />
                  {headingB}
                </>
              )}
            </h1>
            {slide.subheading && (
              <p className="mt-4 max-w-sm text-base text-ink/80">{slide.subheading}</p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-6">
              {slide.cta_label && (
                <Link
                  href={slide.cta_url ?? "#"}
                  className="inline-flex items-center gap-2 rounded-full bg-tangerine px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
                >
                  {slide.cta_label}
                  <span aria-hidden>→</span>
                </Link>
              )}
              <Link
                href="/prosfores"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-ink underline underline-offset-4 transition-colors hover:text-forest"
              >
                Δες τις προσφορές
                <span aria-hidden>→</span>
              </Link>
            </div>
            <p className="mt-8 -rotate-2 font-display text-sm font-semibold text-forest/75">
              Καλύτερη ζωή μαζί, για πάντα.
            </p>
          </div>
          {/* Κρατά τη θέση της εικόνας στο grid του desktop. */}
          <div aria-hidden className="hidden md:block" />
        </Container>

        <div className="relative -mt-2 min-h-64 md:absolute md:inset-y-0 md:right-0 md:mt-0 md:w-[46%]">
          {img && (
            <Image
              src={img}
              alt={slide.alt_text ?? ""}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 46vw"
              className="object-cover object-center md:rounded-bl-[4rem] md:rounded-tl-[4rem]"
            />
          )}
          {/* Το «Με αγάπη, για κάθε pet.» και οι πινελιές είναι μέρος της
              φωτογραφίας του design — δεν τα επαναλαμβάνουμε ως overlay. */}
        </div>
      </section>

      <section aria-label="Γιατί εμάς" className="border-b border-line bg-white">
        <Container className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {USPS.map((u) => (
            <div key={u.label} className="flex items-center justify-center gap-3 py-3.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-5 w-5 text-forest"
                aria-hidden
              >
                <path d={u.path} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold text-ink">{u.label}</span>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}

/** Σπάει την επικεφαλίδα στο κόμμα, όπως στο mockup («Η ευτυχία τους, / ξεκινά εδώ.»). */
function splitHeading(heading: string): [string, string | null] {
  const idx = heading.indexOf(",");
  if (idx === -1 || idx > heading.length - 3) return [heading, null];
  return [heading.slice(0, idx + 1), heading.slice(idx + 1).trim()];
}
