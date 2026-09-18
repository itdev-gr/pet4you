import { Container } from "@/components/Section";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="pb-16 pt-4">
      <Container>
        <div className="h-8 w-48 animate-pulse rounded bg-sand" />
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="h-72 animate-pulse rounded-card bg-sand lg:w-60" />
          <div className="flex-1">
            <ProductGridSkeleton />
          </div>
        </div>
      </Container>
    </div>
  );
}
