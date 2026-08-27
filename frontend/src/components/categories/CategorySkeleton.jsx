"use client";

export default function CategorySkeleton() {
  return (
    <div className="space-y-4 font-mono animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--border)]" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-[var(--border)]" />
            <div className="h-3 w-64 rounded bg-[var(--border)]" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-xl bg-[var(--border)]" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-4 min-h-[180px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[var(--border)]" />
                  <div className="h-4 w-28 rounded bg-[var(--border)]" />
                </div>
                <div className="h-4 w-10 rounded bg-[var(--border)]" />
              </div>
              <div className="h-3 w-full rounded bg-[var(--border)]" />
              <div className="h-3 w-3/4 rounded bg-[var(--border)]" />
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-[var(--border)]" />
              <div className="h-6 w-16 rounded bg-[var(--border)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
