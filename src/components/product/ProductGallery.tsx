"use client";

import { useState } from "react";
import Image from "next/image";
import { productImageUrl } from "@/lib/store/images";
import type { ProductImage } from "@/lib/store/types";

export function ProductGallery({
  images,
  title,
  isNew,
}: {
  images: ProductImage[];
  title: string;
  isNew: boolean;
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[Math.min(active, Math.max(images.length - 1, 0))];
  const mainUrl = productImageUrl(current?.storage_path);

  return (
    <div>
      {/* Ελαφρώς portrait, όπως το panel του mockup. */}
      <div className="relative aspect-[14/15] overflow-hidden rounded-card bg-lilac-soft">
        {mainUrl && (
          <Image
            src={mainUrl}
            alt={current?.alt_text ?? title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-transform duration-300 ${
              zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            }`}
          />
        )}
        {isNew && (
          <span className="absolute left-4 top-4 rounded-full bg-sage-soft px-3.5 py-1.5 text-xs font-bold text-forest">
            ΝΕΟ
          </span>
        )}
        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          aria-label={zoomed ? "Σμίκρυνση εικόνας" : "Μεγέθυνση εικόνας"}
          aria-pressed={zoomed}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5" aria-hidden>
            <path d="m21 21-4.3-4.3M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0ZM10.5 8v5M8 10.5h5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((img, i) => {
            const url = productImageUrl(img.storage_path);
            return (
              <button
                key={img.storage_path}
                type="button"
                onClick={() => {
                  setActive(i);
                  setZoomed(false);
                }}
                aria-label={`Εικόνα ${i + 1} από ${images.length}`}
                aria-current={i === active}
                className={`relative aspect-square overflow-hidden rounded-[0.6rem] border-2 bg-lilac-soft transition-colors ${
                  i === active ? "border-forest" : "border-transparent hover:border-line"
                }`}
              >
                {url && (
                  <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
