// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <main className="flex flex-col overflow-x-hidden p-6 gap-6">
      {/* WelcomeSection skeleton */}
      <div className="h-20 rounded-xl bg-muted animate-pulse" />

      {/* StudySessionChoice skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 rounded-xl bg-muted animate-pulse" />
        <div className="h-32 rounded-xl bg-muted animate-pulse" />
      </div>

      {/* ProgressSection skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
      </div>

      {/* ActivityTable skeleton */}
      <div className="flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    </main>
  );
}
