import { API_ENDPOINTS } from "@/constants/api";
import { apiRequest } from "@/lib/api/client";
import { buildPaginationQuery } from "@/lib/api/pagination";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  ChatMessage,
  ChatPaginationParams,
  ChatSession,
  CreateChatSessionDto,
  SendMessageDto,
  SendMessageResponse,
  UpdateChatSessionDto,
} from "../types/chat.types";

export const chatApi = {
  listSessions: (params?: ChatPaginationParams): Promise<PaginatedResponse<ChatSession>> =>
    apiRequest<PaginatedResponse<ChatSession>>(
      `${API_ENDPOINTS.CHAT.SESSIONS}${buildPaginationQuery(params)}`,
      { auth: true },
    ),

  getSession: (id: string): Promise<ChatSession> =>
    apiRequest<ChatSession>(API_ENDPOINTS.CHAT.SESSION_BY_ID(id), { auth: true }),

  createSession: (dto: CreateChatSessionDto = {}): Promise<ChatSession> => {
    const payload: CreateChatSessionDto = {};
    if (dto.title?.trim()) payload.title = dto.title.trim();
    if (dto.type) payload.type = dto.type;
    return apiRequest<ChatSession>(API_ENDPOINTS.CHAT.SESSIONS, {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    });
  },

  updateSession: (id: string, dto: UpdateChatSessionDto): Promise<ChatSession> => {
    const payload: UpdateChatSessionDto = {};
    if (dto.title?.trim()) payload.title = dto.title.trim();
    if (dto.status) payload.status = dto.status;
    return apiRequest<ChatSession>(API_ENDPOINTS.CHAT.SESSION_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
      auth: true,
    });
  },

  deleteSession: (id: string): Promise<void> =>
    apiRequest<void>(API_ENDPOINTS.CHAT.SESSION_BY_ID(id), {
      method: "DELETE",
      auth: true,
    }),

  listMessages: (
    sessionId: string,
    params?: ChatPaginationParams,
  ): Promise<PaginatedResponse<ChatMessage>> =>
    apiRequest<PaginatedResponse<ChatMessage>>(
      `${API_ENDPOINTS.CHAT.MESSAGES(sessionId)}${buildPaginationQuery(params)}`,
      { auth: true },
    ),

  sendMessage: async (sessionId: string, dto: SendMessageDto): Promise<SendMessageResponse> => {
    const payload: SendMessageDto = { content: dto.content.trim() };
    const reply = await apiRequest<SendMessageResponse>(API_ENDPOINTS.CHAT.MESSAGES(sessionId), {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    });
    // The reply envelope names the provider but the assistant message itself
    // carries no metadata, so surface the provider for the UI badge.
    return {
      ...reply,
      assistantMessage: {
        ...reply.assistantMessage,
        metadata: { provider: reply.provider },
      },
    };
  },
};
