"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/constants/query-keys";
import { PAGINATION_DEFAULTS } from "@/constants/pagination";
import { errorMessage } from "@/lib/api/error";
import { dedupeById } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/pagination";
import { chatApi } from "../api/chat.api";
import type {
  ChatMessage,
  CreateChatSessionDto,
  SendMessageDto,
  SendMessageResponse,
  UpdateChatSessionDto,
} from "../types/chat.types";

export interface SendMessageVariables extends SendMessageDto {
  sessionId: string;
}

interface SendMessageContext {
  optimisticUserMessage: ChatMessage;
  optimisticAssistantMessage: ChatMessage;
}

function toMessagePage(
  messages: ChatMessage[],
  limit: number = PAGINATION_DEFAULTS.limit,
): PaginatedResponse<ChatMessage> {
  return {
    items: messages,
    meta: {
      page: 1,
      limit,
      totalItems: messages.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

function mergeIntoMessages(current: ChatMessage[] | undefined, next: ChatMessage[]): ChatMessage[] {
  const items = current ?? [];
  return dedupeById([...items, ...next]);
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto?: CreateChatSessionDto) => chatApi.createSession(dto ?? {}),
    onSuccess: (newSession) => {
      queryClient.setQueryData(chatKeys.session(newSession.id), newSession);
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, Error, SendMessageVariables, SendMessageContext>({
    mutationFn: ({ sessionId, content }) => chatApi.sendMessage(sessionId, { content }),

    onMutate: async ({ sessionId, content }) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(sessionId) });

      const now = new Date().toISOString();
      const nonce = `${now}-${Math.random().toString(36).slice(2, 8)}`;
      const optimisticUserMessage: ChatMessage = {
        id: `optimistic-user-${nonce}`,
        role: "user",
        content,
        status: "completed",
        createdAt: now,
        updatedAt: now,
      };
      const optimisticAssistantMessage: ChatMessage = {
        id: `optimistic-assistant-${nonce}`,
        role: "assistant",
        content: "",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueryData<PaginatedResponse<ChatMessage>>(
        chatKeys.messages(sessionId),
        (old) => {
          const current = old?.items ?? [];
          const next = [...current, optimisticUserMessage, optimisticAssistantMessage];
          return old ? { ...old, items: next } : toMessagePage(next);
        },
      );

      return { optimisticUserMessage, optimisticAssistantMessage };
    },

    onError: (error, { sessionId }, context) => {
      if (!context) return;
      const failure =
        errorMessage(error) ||
        "Failed to generate a response. Please check your connection and try again.";

      queryClient.setQueryData<PaginatedResponse<ChatMessage>>(
        chatKeys.messages(sessionId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((item) =>
              item.id === context.optimisticAssistantMessage.id
                ? { ...item, status: "failed" as const, content: failure }
                : item,
            ),
          };
        },
      );
    },

    onSuccess: (data, { sessionId }, context) => {
      queryClient.setQueryData<PaginatedResponse<ChatMessage>>(
        chatKeys.messages(sessionId),
        (old) => {
          const current = old?.items ?? [];
          const withoutOptimistic = context
            ? current.filter(
                (item) =>
                  item.id !== context.optimisticUserMessage.id &&
                  item.id !== context.optimisticAssistantMessage.id,
              )
            : current;
          const merged = mergeIntoMessages(withoutOptimistic, [
            data.userMessage,
            data.assistantMessage,
          ]);
          return old
            ? {
                ...old,
                items: merged,
                meta: toMessagePage(merged, Math.max(PAGINATION_DEFAULTS.limit, merged.length))
                  .meta,
              }
            : toMessagePage(merged);
        },
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & UpdateChatSessionDto) =>
      chatApi.updateSession(id, dto),
    onSuccess: (updatedSession, { id }) => {
      queryClient.setQueryData(chatKeys.session(id), updatedSession);
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chatApi.deleteSession(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: chatKeys.messages(id) });
      queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}
