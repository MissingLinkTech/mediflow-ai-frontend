import { API_ENDPOINTS } from "@/constants/api";
import { apiRequest } from "@/lib/api/client";
import { buildPaginationQuery } from "@/lib/api/pagination";
import type { PaginatedResponse } from "@/types/pagination";
import type { AdminUser, AdminUsersPaginationParams } from "../types/admin.types";

export const adminApi = {
  listUsers: (params?: AdminUsersPaginationParams): Promise<PaginatedResponse<AdminUser>> =>
    apiRequest<PaginatedResponse<AdminUser>>(
      `${API_ENDPOINTS.users.list}${buildPaginationQuery(params)}`,
      { auth: true },
    ),
};
