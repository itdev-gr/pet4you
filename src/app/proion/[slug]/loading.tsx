import { Container } from "@/components/Section";

export default function Loading() {
  return (
    <div className="pb-16 pt-4">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div className="animate-pulse">
          <div className="aspect-square rounded-tile bg-sand" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="aspect-square rounded-card bg-sand" />
            ))}
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-24 rounded bg-sand" />
          <div className="h-10 w-3/4 rounded bg-sand" />
          <div className="h-4 w-1/2 rounded bg-sand" />
          <div className="h-9 w-32 rounded bg-sand" />
          <div className="h-12 w-full rounded bg-sand" />
          <div className="h-12 w-full rounded-full bg-sand" />
        </div>
      </Container>
    </div>
  );
}
