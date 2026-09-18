import Link from "next/link";
import { getMenu } from "@/lib/store/queries";
import { Logo, PawIcon } from "@/components/Logo";
import { CartLink, WishlistLink } from "@/components/layout/HeaderCounts";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Container } from "@/components/Section";

const SEARCH_ICON = "m21 21-4.3-4.3M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z";
const USER_ICON = "M20 21a8 8 0 1 0-16 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z";

function SearchField({ id, className = "" }: { id: string; className?: string }) {
  return (
    <form action="/anazitisi" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Αναζήτηση προϊόντων
      </label>
      <input
        id={id}
        type="search"
        name="q"
        placeholder="Τι ψάχνεις για το κατοικίδιό σου;"
        className="w-full rounded-full border border-line bg-cream py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-forest"
      />
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5" aria-hidden>
          <path d={SEARCH_ICON} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </form>
  );
}

export async function Header() {
  const menu = await getMenu();

  return (
    <header className="bg-white">
      <div className="bg-forest px-4 py-1.5 text-center text-sm text-white">
        <span className="inline-flex items-center gap-1.5">
          Για κάθε μικρό, μεγάλο μας φίλο.
          <PawIcon className="h-3.5 w-3.5 text-tangerine-bright" />
        </span>
      </div>

      <Container className="flex items-center gap-6 py-4">
        <MobileMenu menu={menu} />
        <Logo />
        <SearchField id="site-search" className="hidden flex-1 md:block" />
        <nav className="ml-auto flex items-center gap-5 text-sm" aria-label="Λογαριασμός">
          <Link href="/logariasmos" className="hidden items-center gap-1.5 text-ink hover:text-forest sm:flex">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
              <path d={USER_ICON} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden lg:inline">Ο λογαριασμός μου</span>
          </Link>
          <WishlistLink />
          <CartLink />
        </nav>
      </Container>

      {/* Η αναζήτηση παραμένει προσβάσιμη στο mobile, σε δική της σειρά. */}
      <Container className="pb-3 md:hidden">
        <SearchField id="site-search-mobile" />
      </Container>

      <div className="border-b border-line">
        <Container className="hidden items-center gap-1 md:flex">
          <nav className="flex flex-1 items-center justify-center gap-1" aria-label="Κατηγορίες">
            {menu.map((cat) => (
              <div key={cat.id} className="group relative">
                <Link
                  href={cat.url ?? "#"}
                  className="block whitespace-nowrap px-4 py-3 text-sm font-semibold text-ink transition-colors hover:text-forest"
                >
                  {cat.label}
                </Link>
                {cat.columns.length > 0 && (
                  /* `group-focus-within` ώστε το submenu να ανοίγει και με Tab:
                     με σκέτο hover οι σύνδεσμοί του ήταν άφταστοι από πληκτρολόγιο. */
                  <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-1 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="flex gap-10 rounded-b-card border border-t-0 border-line bg-white px-8 py-6 shadow-lg">
                      {cat.columns.map((col) => (
                        <div key={col.id} className="min-w-36">
                          <Link href={col.url ?? "#"} className="text-sm font-bold text-forest hover:underline">
                            {col.title}
                          </Link>
                          <ul className="mt-2.5 space-y-1.5">
                            {col.links.map((l) => (
                              <li key={l.id}>
                                <Link href={l.url} className="whitespace-nowrap text-sm text-ink-soft hover:text-forest">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <Link
            href="/prosfores"
            className="my-1.5 whitespace-nowrap rounded-full bg-tangerine px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-tangerine-dark"
          >
            Προσφορές
          </Link>
        </Container>
      </div>
    </header>
  );
}
