import type { PaginationParams } from "@/types/pagination";

export function buildPaginationQuery(params?: PaginationParams): string {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}
