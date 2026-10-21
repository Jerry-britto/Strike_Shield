/**
 * Shimmer placeholders shown while content loads, so layouts don't jump around
 * (avoids layout shift / jarring empty screens).
 */

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square w-full rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }) {
  return (
    <div className="card divide-y divide-navy-100 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="skeleton h-16 w-16 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/2" />
          </div>
          <div className="skeleton h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 4 }) {
  return (
    <div className="card overflow-hidden p-4">
      <div className="mb-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-t border-navy-100 py-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="skeleton h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
