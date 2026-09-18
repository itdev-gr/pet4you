"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/wishlist/WishlistContext";

function Badge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute -right-2 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-tangerine px-1 text-[10px] font-bold text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function WishlistLink() {
  const { count } = useWishlist();
  return (
    <Link href="/agapimena" className="relative flex items-center gap-1.5 text-ink hover:text-forest">
      <span className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
          <path
            d="M12 20.3 4.9 13a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Badge value={count} />
      </span>
      <span className="hidden sm:inline">Αγαπημένα</span>
    </Link>
  );
}

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/kalathi"
      className="flex flex-col items-center text-ink hover:text-forest"
      aria-label={`Καλάθι — ${count} προϊόντα`}
    >
      <span className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
          <path
            d="M3 5h2l2.2 11.2A2 2 0 0 0 9.2 18h8.6a2 2 0 0 0 2-1.6L21.5 9H6M10 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Badge value={count} />
      </span>
      <span className="text-[11px] leading-tight">Καλάθι</span>
    </Link>
  );
}
