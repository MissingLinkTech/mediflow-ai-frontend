"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { authApi } from "../api/auth.api";
import { useAuth } from "../components/auth-provider";

export function useCurrentUser() {
  const { status } = useAuth();
  return useQuery({
    queryKey: queryKeys.account.profile(),
    queryFn: authApi.profile,
    enabled: status === "authenticated",
    staleTime: 5 * 60_000,
  });
}
