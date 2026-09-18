import Link from "next/link";

const ROWS = [
  {
    label: "Πληροφορίες αποστολής",
    href: "/selida/apostoles",
    path: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  },
  {
    label: "Επιστροφές & αλλαγές",
    href: "/selida/epistrofes",
    path: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5",
  },
  {
    label: "Χρειάζεσαι βοήθεια με το μέγεθος;",
    href: "/selida/epikoinonia",
    path: "M4 14v-3a8 8 0 0 1 16 0v3M4 14h3v5H5.5A1.5 1.5 0 0 1 4 17.5Zm16 0h-3v5h1.5a1.5 1.5 0 0 0 1.5-1.5Z",
  },
];

export function InfoRows() {
  return (
    <div className="mt-8 divide-y divide-line border-y border-line">
      {ROWS.map((row) => (
        <Link
          key={row.label}
          href={row.href}
          className="flex items-center gap-3 py-3.5 text-sm font-semibold text-ink transition-colors hover:text-forest"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5 text-forest" aria-hidden>
            <path d={row.path} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {row.label}
          <span aria-hidden className="ml-auto text-ink-soft">
            ›
          </span>
        </Link>
      ))}
    </div>
  );
}
