import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="route-loading">
      <Skeleton className="skeleton--title" />
      <div className="skeleton-grid">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  );
}
