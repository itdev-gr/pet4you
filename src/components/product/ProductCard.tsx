import Image from "next/image";
import Link from "next/link";
import type { ProductCard as ProductCardData } from "@/lib/store/types";
import { productImageUrl } from "@/lib/store/images";
import { formatPrice } from "@/lib/format";
import { PawIcon } from "@/components/Logo";
import { WishlistButton } from "@/components/product/WishlistButton";

/** Κάρτα προϊόντος — εικόνα χωρίς κορνίζα, πληροφορίες κοντά της (όπως το mockup). */
export function ProductCard({ product }: { product: ProductCardData }) {
  const img = productImageUrl(product.imagePath);
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-card bg-sand">
        {img ? (
          <Image
            src={img}
            alt={product.imageAlt ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sage">
            <PawIcon className="h-12 w-12" />
          </div>
        )}
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-forest">
            ΝΕΟ
          </span>
        )}
        <WishlistButton
          slug={product.slug}
          title={product.title}
          className="absolute right-2.5 top-2.5"
        />
      </div>

      <div className="mt-2.5 flex flex-1 flex-col">
        {product.vendor && <span className="text-xs text-ink-soft">{product.vendor}</span>}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-ink">
          <Link href={`/proion/${product.slug}`} className="after:absolute after:inset-0">
            {product.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="font-display text-lg font-bold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-ink-soft line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <span
            aria-hidden
            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tangerine text-white transition-colors group-hover:bg-tangerine-dark"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4.5 w-4.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
