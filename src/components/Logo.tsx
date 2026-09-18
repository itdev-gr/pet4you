import Link from "next/link";

export function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <ellipse cx="12" cy="15.5" rx="4.6" ry="4" />
      <ellipse cx="5.4" cy="10.8" rx="2" ry="2.6" transform="rotate(-20 5.4 10.8)" />
      <ellipse cx="9.4" cy="7.4" rx="2" ry="2.7" />
      <ellipse cx="14.6" cy="7.4" rx="2" ry="2.7" />
      <ellipse cx="18.6" cy="10.8" rx="2" ry="2.6" transform="rotate(20 18.6 10.8)" />
    </svg>
  );
}

const SIZES = {
  default: { text: "text-[1.9rem]", paw: "h-6 w-6" },
  lg: { text: "text-[2.1rem]", paw: "h-7 w-7" },
} as const;

export function Logo({
  light = false,
  size = "default",
}: {
  light?: boolean;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  return (
    <Link href="/" className="flex shrink-0 items-center gap-1.5" aria-label="pet shop — Αρχική">
      <span
        className={`font-display ${s.text} font-extrabold leading-none tracking-[-0.03em] ${
          light ? "text-white" : "text-forest"
        }`}
      >
        pet shop.
      </span>
      <PawIcon className={`${s.paw} text-tangerine-bright`} />
    </Link>
  );
}
