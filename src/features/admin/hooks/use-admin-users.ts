"use client";

import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/constants/query-keys";
import { adminApi } from "../api/admin.api";
import type { AdminUsersPaginationParams } from "../types/admin.types";

export function useAdminUsers(params?: AdminUsersPaginationParams) {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.listUsers(params),
    staleTime: 30_000,
  });
}
