import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | null, email: string): string {
  return (name?.trim() || email)
    .split(/[\s@]+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * De-duplicate items by `id` while preserving the latest occurrence so the
 * freshest copy wins.
 */
export function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Map<string, T>();
  for (const item of items) {
    seen.set(item.id, item);
  }
  return Array.from(seen.values());
}
