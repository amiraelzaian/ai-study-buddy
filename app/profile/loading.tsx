// app/profile/loading.tsx
export default function Loading() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 mx-2 gap-4 p-4">
      {/* InfoCard skeleton */}
      <div className="col-span-1 flex flex-col gap-4 p-6 rounded-xl border border-border">
        <div className="w-20 h-20 rounded-full bg-muted animate-pulse mx-auto" />
        <div className="h-5 w-32 rounded bg-muted animate-pulse mx-auto" />
        <div className="h-4 w-48 rounded bg-muted animate-pulse mx-auto" />
        <div className="h-4 w-40 rounded bg-muted animate-pulse mx-auto" />
      </div>

      {/* Right column */}
      <div className="col-span-2 flex flex-col gap-5">
        {/* ProgressSection skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-64 rounded-xl bg-muted animate-pulse" />
          <div className="h-64 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>
    </section>
  );
}
