export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-veez-gray-300 border-t-veez-black rounded-full animate-spin" />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <div className="bg-veez-gray-200 h-64 rounded animate-pulse" />
      <div className="bg-veez-gray-200 h-4 rounded animate-pulse w-3/4" />
      <div className="bg-veez-gray-200 h-4 rounded animate-pulse w-1/2" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
