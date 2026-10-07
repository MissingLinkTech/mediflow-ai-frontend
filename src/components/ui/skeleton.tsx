import { cn } from "@/lib/utils";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn("skeleton block min-h-20 animate-pulse rounded-xl bg-[#e5eeeb]", className)}
      aria-hidden="true"
    />
  );
}
