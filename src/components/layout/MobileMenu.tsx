"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { MenuCategory } from "@/lib/store/types";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Πλήρης πρόσβαση σε κατηγορίες και λογαριασμό στο mobile.
 *
 * Συμπεριφέρεται ως modal dialog: η εστίαση μπαίνει μέσα όταν ανοίγει, μένει
 * παγιδευμένη όσο είναι ανοιχτό, και επιστρέφει στο κουμπί που το άνοιξε.
 * Χωρίς αυτό, η πλοήγηση με Tab έβγαινε στη σελίδα πίσω από το overlay.
 */
export function MobileMenu({ menu }: { menu: MenuCategory[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Αρχική εστίαση στο πρώτο στοιχείο του πάνελ.
    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!panel.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Άνοιγμα μενού"
        aria-expanded={open}
        className="-ml-1 p-1.5 text-ink md:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-6 w-6" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            aria-hidden
            onClick={close}
            className="absolute inset-0 bg-ink/40"
          />
          <nav
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Κύριο μενού"
            className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col overflow-y-auto bg-white"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-display text-lg font-extrabold text-forest">Μενού</span>
              <button
                type="button"
                onClick={close}
                aria-label="Κλείσιμο μενού"
                className="p-1 text-ink-soft hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5" aria-hidden>
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <ul className="flex-1 px-5 py-4">
              {menu.map((cat) => (
                <li key={cat.id} className="border-b border-line/70 last:border-0">
                  <Link
                    href={cat.url ?? "#"}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-sm font-bold text-ink"
                  >
                    {cat.label}
                  </Link>
                  {cat.columns.length > 0 && (
                    <ul className="-mt-1 mb-3 space-y-1.5 pl-3">
                      {cat.columns.flatMap((col) =>
                        col.links.map((l) => (
                          <li key={l.id}>
                            <Link
                              href={l.url}
                              onClick={() => setOpen(false)}
                              className="block py-0.5 text-sm text-ink-soft"
                            >
                              {l.label}
                            </Link>
                          </li>
                        )),
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-line px-5 py-4">
              <Link
                href="/prosfores"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-tangerine px-5 py-2.5 text-center text-sm font-bold text-white"
              >
                Προσφορές
              </Link>
              <Link
                href="/logariasmos"
                onClick={() => setOpen(false)}
                className="block rounded-full border border-line px-5 py-2.5 text-center text-sm font-bold text-ink"
              >
                Ο λογαριασμός μου
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
