import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Section";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Αγορές",
    links: [
      { label: "Σκύλος", href: "/katigoria/skylos" },
      { label: "Γάτα", href: "/katigoria/gata" },
      { label: "Μικρά ζώα", href: "/katigoria/mikra-zoa" },
      { label: "Πτηνά", href: "/katigoria/ptina" },
      { label: "Ψάρια", href: "/katigoria/psaria" },
      { label: "Προσφορές", href: "/prosfores" },
    ],
  },
  {
    title: "Εξυπηρέτηση",
    links: [
      { label: "Επικοινωνία", href: "/selida/epikoinonia" },
      { label: "Αποστολές", href: "/selida/apostoles" },
      { label: "Επιστροφές", href: "/selida/epistrofes" },
      { label: "Συχνές ερωτήσεις", href: "/selida/syxnes-erotiseis" },
    ],
  },
  {
    title: "Η εταιρεία",
    links: [
      { label: "Σχετικά με εμάς", href: "/selida/sxetika-me-emas" },
      { label: "Καταστήματα", href: "/selida/epikoinonia" },
      { label: "Η ομάδα μας", href: "/selida/sxetika-me-emas" },
      { label: "Βιώσιμη ανάπτυξη", href: "/selida/sxetika-me-emas" },
    ],
  },
];

const SOCIAL = [
  { label: "Facebook", href: "#", path: "M14 8h2.5V5H14a4 4 0 0 0-4 4v2H7.5v3H10v7h3v-7h2.6l.4-3H13V9a1 1 0 0 1 1-1Z" },
  {
    label: "Instagram",
    href: "#",
    path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5ZM17.3 6.2a.8.8 0 1 0 .8.8.8.8 0 0 0-.8-.8Z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z",
  },
  {
    label: "TikTok",
    href: "#",
    path: "M16.6 3a4.8 4.8 0 0 0 3.4 3.4v3a7.8 7.8 0 0 1-3.4-1v6.1a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1a2.5 2.5 0 1 0 1.5 2.3V3Z",
  },
];

/** Οι τρόποι πληρωμής που πραγματικά υποστηρίζει το κατάστημα. */
const PAYMENTS = ["Αντικαταβολή", "Τραπεζική κατάθεση"];

export function Footer() {
  return (
    <footer className="bg-forest-dark text-white">
      {/* Έξι tracks: το logo πιάνει δύο, οι τρεις στήλες από ένα, τα social το τελευταίο. */}
      <Container className="grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo light size="lg" />
          <p className="mt-3 text-sm text-white/80">Μαζί, σε κάθε πατούσα.</p>
          <svg
            viewBox="0 0 80 28"
            className="mt-5 h-7 w-20 text-white/45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
          >
            <path
              d="M4 20c10-14 22-14 30-6M44 14l-3-8m6 9 6-4-2 7 7-1-5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-bold">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/75 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h3 className="text-sm font-bold">Ακολούθησέ μας</h3>
          <div className="mt-3 flex gap-2.5">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4 text-xs text-white/70">
          <span>© 2026 pet shop. Όλα τα δικαιώματα διατηρούνται.</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/selida/oroi-xrisis" className="hover:text-white">
              Όροι χρήσης
            </Link>
            <Link href="/selida/politiki-aporritou" className="hover:text-white">
              Πολιτική απορρήτου
            </Link>
            <span>Cookies</span>
          </div>
          <div className="flex items-center gap-2" aria-label="Τρόποι πληρωμής">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold">
                {p}
              </span>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
