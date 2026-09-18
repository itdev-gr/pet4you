"use client";

import { useWishlist } from "@/lib/wishlist/WishlistContext";

/** Καρδιά αγαπημένων — plain outline πάνω στην εικόνα, όπως το mockup. */
export function WishlistButton({
  slug,
  title,
  className = "",
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const active = has(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={
        active ? `Αφαίρεση από τα αγαπημένα: ${title}` : `Προσθήκη στα αγαπημένα: ${title}`
      }
      /* Καμία θέση εδώ: η τοποθέτηση ανήκει στον caller, αλλιώς δύο κλάσεις
         θέσης ίδιας ειδικότητας συγκρούονται και κερδίζει η σειρά του CSS. */
      className={`z-10 p-1.5 transition-colors ${
        active ? "text-tangerine" : "text-ink/70 hover:text-tangerine"
      } ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5 drop-shadow-sm"
        aria-hidden
      >
        <path
          d="M12 20.3 4.9 13a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
