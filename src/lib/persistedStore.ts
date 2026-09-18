"use client";

import { useSyncExternalStore } from "react";

/**
 * Μικρό store για κατάσταση που ζει στον localStorage του επισκέπτη
 * (καλάθι, αγαπημένα).
 *
 * Διαβάζουμε με `useSyncExternalStore` αντί για `setState` μέσα σε effect:
 * ο server δεν έχει localStorage, οπότε το πρώτο render πρέπει να δώσει το
 * κενό snapshot και η πραγματική τιμή να έρθει στο hydration χωρίς επιπλέον
 * κύκλο render.
 *
 * Αν η αποθήκευση δεν είναι διαθέσιμη (private mode, αποκλεισμένα site data,
 * γεμάτη quota), το store πέφτει σε **memory-only mode**: κρατά την τιμή στη
 * μνήμη για τη διάρκεια της συνεδρίας και σταματά να διαβάζει από τον disk —
 * αλλιώς το επόμενο snapshot θα έσβηνε ό,τι μόλις πρόσθεσε ο χρήστης.
 *
 * Το `isValid` προστατεύει από χαλασμένο ή παλιάς μορφής περιεχόμενο: ό,τι
 * δεν περνά τον έλεγχο αντιμετωπίζεται ως κενό, ώστε ένα `{}` αντί για πίνακα
 * να μη ρίχνει τη σελίδα στο πρώτο `.map()`.
 */
export function createPersistedStore<T>(
  key: string,
  empty: T,
  isValid: (value: unknown) => value is T,
) {
  let cache: T = empty;
  let raw: string | null = null;
  let memoryOnly = false;
  const listeners = new Set<() => void>();

  function parse(value: string | null): T {
    if (value === null) return empty;
    try {
      const parsed: unknown = JSON.parse(value);
      return isValid(parsed) ? parsed : empty;
    } catch {
      return empty;
    }
  }

  function getSnapshot(): T {
    if (memoryOnly) return cache;
    let current: string | null;
    try {
      current = localStorage.getItem(key);
    } catch {
      memoryOnly = true;
      return cache;
    }
    if (current === raw) return cache;
    raw = current;
    cache = parse(current);
    return cache;
  }

  /** Ο server και το πρώτο client render μοιράζονται το ίδιο snapshot. */
  function getServerSnapshot(): T {
    return empty;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    // Αλλαγές από άλλη καρτέλα του ίδιου καταστήματος.
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function set(next: T) {
    const serialized = JSON.stringify(next);
    cache = next;
    if (!memoryOnly) {
      try {
        localStorage.setItem(key, serialized);
        raw = serialized;
      } catch {
        // Η τιμή μένει μόνο στη μνήμη· σταματάμε να διαβάζουμε από τον disk
        // ώστε να μη χαθεί στο επόμενο snapshot.
        memoryOnly = true;
      }
    }
    emit();
  }

  function update(fn: (current: T) => T) {
    set(fn(getSnapshot()));
  }

  return {
    set,
    update,
    useValue(): T {
      return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    },
    /** false στον server και στο πρώτο render — για skeleton states. */
    useHydrated(): boolean {
      return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
      );
    },
  };
}
