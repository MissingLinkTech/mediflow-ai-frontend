"use client";

import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "@/constants/query-keys";
import { chatApi } from "../api/chat.api";
import type { ChatPaginationParams } from "../types/chat.types";

export function useChatMessages(
  sessionId: string | null | undefined,
  params?: ChatPaginationParams,
) {
  return useQuery({
    queryKey: chatKeys.messages(sessionId ?? ""),
    queryFn: () => chatApi.listMessages(sessionId!, params),
    enabled: Boolean(sessionId),
    staleTime: 10_000,
  });
}
