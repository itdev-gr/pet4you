export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-card bg-sand" />
          <div className="mt-3 h-3 w-16 rounded bg-sand" />
          <div className="mt-2 h-4 w-3/4 rounded bg-sand" />
          <div className="mt-3 h-5 w-20 rounded bg-sand" />
        </div>
      ))}
    </div>
  );
}
