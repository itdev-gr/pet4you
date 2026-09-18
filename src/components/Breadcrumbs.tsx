import Link from "next/link";
import { Container } from "@/components/Section";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Container as="div" className="py-4">
      <nav aria-label="Διαδρομή">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
        <li>
          <Link href="/" className="hover:text-forest">
            Αρχική
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <span aria-hidden>/</span>
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-forest">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
        </ol>
      </nav>
    </Container>
  );
}
