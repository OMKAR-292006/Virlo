export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
  );
}

export function KpiSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-10 h-4" />
      </div>
      <Skeleton className="w-16 h-7" />
      <Skeleton className="w-20 h-3" />
    </div>
  );
}
