import Image from "next/image";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/Section";

/* ------------------------------------------------------------------ */
/* Promo banners — «Κάθε βόλτα, μια περιπέτεια» + «Το δικό τους happy place» */
/* ------------------------------------------------------------------ */

export function PromoBanners() {
  return (
    /* Κείμενο σε συμπαγές χρώμα αριστερά, φωτογραφία δεξιά — όπως το mockup.
       Η φωτογραφία δεν μπαίνει ξεθωριασμένη πίσω από το κείμενο. */
    <Container as="section" className="grid gap-5 md:grid-cols-2">
      <div className="grid overflow-hidden rounded-tile bg-forest text-white sm:grid-cols-[1.1fr_1fr]">
        <div className="flex min-h-56 flex-col justify-between p-7">
          <div>
            <h2 className="font-display text-[1.6rem] font-extrabold leading-tight">
              Κάθε βόλτα,
              <br />
              μια περιπέτεια.
            </h2>
            <p className="mt-2 text-sm text-white/85">
              Εξοπλισμός για ατελείωτες στιγμές μαζί.
            </p>
          </div>
          <Link
            href="/katigoria/aksesouar-voltas"
            className="mt-6 inline-block w-fit rounded-full bg-tangerine px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
          >
            Ανακάλυψε τα αξεσουάρ →
          </Link>
        </div>
        <div className="relative min-h-40">
          <Image
            src="/images/banner-walk.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
          {/* Λευκό πάνω σε φωτογραφία δεν έχει εγγυημένη αντίθεση — μικρό
              σκούρο υπόβαθρο ώστε να διαβάζεται σε κάθε λήψη. */}
          <span className="absolute right-3 top-3 hidden -rotate-6 rounded-lg bg-forest-dark/75 px-2.5 py-1.5 text-center font-display text-[0.7rem] font-bold leading-tight text-white lg:block">
            Πιο κοντά
            <br />
            κάθε μέρα
          </span>
        </div>
      </div>

      <div className="grid overflow-hidden rounded-tile bg-sand sm:grid-cols-[1.1fr_1fr]">
        <div className="flex min-h-56 flex-col justify-between p-7">
          <div>
            <h2 className="font-display text-[1.6rem] font-extrabold leading-tight text-ink">
              Το δικό τους
              <br />
              happy place.
            </h2>
            <p className="mt-2 text-sm text-ink/75">Άνεση, φροντίδα, αγάπη.</p>
          </div>
          <Link
            href="/katigoria/gata"
            className="mt-6 inline-block w-fit rounded-full bg-tangerine px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
          >
            Δες προϊόντα για γάτες →
          </Link>
        </div>
        <div className="relative min-h-40">
          <Image
            src="/images/banner-cozy.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        </div>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Story banner — «Νέο μέλος στην οικογένεια;»                          */
/* ------------------------------------------------------------------ */

export function StoryBanner() {
  return (
    <Container as="section">
      <div className="relative overflow-hidden rounded-tile bg-sage-soft">
        <div className="grid items-center md:grid-cols-2">
          <div className="relative z-10 px-8 py-12 lg:px-12">
            <h2 className="font-display text-[2rem] font-extrabold leading-tight text-ink lg:text-[2.5rem]">
              Νέο μέλος
              <br />
              στην οικογένεια;
            </h2>
            <p className="mt-3 max-w-xs text-sm text-ink/75">
              Όλα για ένα όμορφο ξεκίνημα μαζί.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/katigoria/skylos"
                className="rounded-full bg-tangerine px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
              >
                Έχω κουτάβι →
              </Link>
              <Link
                href="/katigoria/gata"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition-colors hover:bg-sunshine"
              >
                Έχω γατάκι →
              </Link>
            </div>
          </div>
          <div className="relative min-h-56 self-stretch md:min-h-72">
            <Image
              src="/images/story-family.jpg"
              alt="Κουτάβι και γατάκι μαζί"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="absolute right-6 top-6 hidden rounded-full bg-white/95 px-3 py-1.5 font-display text-xs font-bold text-ink shadow-sm md:block">
              Μεγαλώνουμε μαζί
            </span>
          </div>
        </div>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Service cards — «Η φροντίδα δεν σταματά στο καλάθι.»                 */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    img: "/images/service-grooming.jpg",
    title: "Grooming",
    text: "Για ένα καθαρό και ευτυχισμένο pet.",
    cta: "Κλείσε ραντεβού",
    href: "/selida/epikoinonia",
  },
  {
    img: "/images/service-advice.jpg",
    title: "Συμβουλές φροντίδας",
    text: "Οι ειδικοί μας είναι δίπλα σου.",
    cta: "Μάθε περισσότερα",
    href: "/blog",
  },
  {
    img: "/images/service-store.jpg",
    title: "Βρες το κατάστημά σου",
    text: "Μας βρίσκεις πάντα κοντά σου.",
    cta: "Δες τα καταστήματα",
    href: "/selida/epikoinonia",
  },
];

export function ServiceCards() {
  return (
    <Container as="section">
      <SectionHeading title="Η φροντίδα δεν σταματά στο καλάθι." />
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <article key={s.title}>
            <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-sand">
              <Image src={s.img} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
            </div>
            <h3 className="mt-3 font-display text-lg font-bold text-ink">{s.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
            <Link href={s.href} className="mt-2 inline-block text-sm font-bold text-forest hover:underline">
              {s.cta} →
            </Link>
          </article>
        ))}
      </div>
    </Container>
  );
}
