export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-200" />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
