"use client";

import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "@/constants/query-keys";
import { chatApi } from "../api/chat.api";
import type { ChatPaginationParams } from "../types/chat.types";

export function useChatSessions(params?: ChatPaginationParams) {
  return useQuery({
    queryKey: chatKeys.sessions(params),
    queryFn: () => chatApi.listSessions(params),
    staleTime: 30_000,
  });
}

export function useChatSession(id: string | null | undefined) {
  return useQuery({
    queryKey: chatKeys.session(id ?? ""),
    queryFn: () => chatApi.getSession(id!),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
