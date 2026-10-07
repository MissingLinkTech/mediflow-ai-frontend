export interface PageMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PageMeta;
}

export function toPaginationParams(page = 1, limit = 20): URLSearchParams {
  return new URLSearchParams({ page: String(page), limit: String(limit) });
}
