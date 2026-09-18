import Image from "next/image";
import Link from "next/link";
import type { HomepageCategory } from "@/lib/store/types";
import { contentImageUrl } from "@/lib/store/images";
import { Container, SectionHeading } from "@/components/Section";

export function CategoryCircles({ categories }: { categories: HomepageCategory[] }) {
  if (categories.length === 0) return null;
  return (
    <Container as="section">
      <SectionHeading title="Για ποιον ψωνίζουμε;" />
      <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6">
        {categories.map((cat) => {
          const img = contentImageUrl(cat.image_path);
          return (
            <Link
              key={cat.id}
              href={cat.url ?? "#"}
              className="group flex flex-col items-center gap-3"
            >
              <span className="relative block aspect-square w-full max-w-36 overflow-hidden rounded-full bg-sand transition-transform group-hover:scale-105">
                {img && <Image src={img} alt="" fill sizes="(max-width: 640px) 30vw, 144px" className="object-cover" />}
              </span>
              <span className="text-sm font-semibold text-ink group-hover:text-forest">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
