import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80", className)} {...props} />;
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-pulse", className)}>
      <Skeleton className="h-40 w-full rounded-2xl bg-slate-200" />
      <Skeleton className="h-5 w-2/3 bg-slate-200" />
      <Skeleton className="h-4 w-full bg-slate-150" />
      <Skeleton className="h-4 w-4/5 bg-slate-150" />
    </div>
  );
}

function SkeletonGrid({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonGrid };
