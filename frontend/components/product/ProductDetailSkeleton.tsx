import { Skeleton } from "@/design-system";

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-3 px-1">
        <Skeleton variant="text" className="h-3 w-20" />
        <Skeleton variant="text" className="h-8 w-3/4" />
        <Skeleton variant="text" className="h-6 w-28" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="rectangular" className="mt-4 h-24 w-full" />
        <Skeleton variant="rectangular" className="h-12 w-full" />
        <Skeleton variant="rectangular" className="h-12 w-full" />
      </div>
    </div>
  );
}
