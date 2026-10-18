import type { PaginationParams } from "@/types/pagination";

export type ChatType = "general" | "health_consultation" | "document_analysis";

export type ChatStatus = "active" | "archived";

export type MessageRole = "user" | "assistant" | "system" | "tool";

export type MessageStatus = "pending" | "completed" | "failed";

export type AiProviderName = "gemini" | "groq" | "openai";

/**
 * Generation metadata for an assistant reply. The backend returns the
 * provider that produced the reply; model, token, and latency values stay
 * server-side, so every field is optional.
 */
export interface MessageMetadata {
  provider?: AiProviderName;
  model?: string;
  tokens?: number;
  latencyMs?: number;
  finishReason?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: MessageMetadata | null;
}

export interface ChatContext {
  id: string;
  contextType: string;
  contextData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  title: string | null;
  type: ChatType;
  status: ChatStatus;
  createdAt: string;
  updatedAt: string;
  context?: ChatContext | null;
}

export interface CreateChatSessionDto {
  title?: string;
  type?: ChatType;
}

export interface SendMessageDto {
  content: string;
}

export interface UpdateChatSessionDto {
  title?: string;
  status?: ChatStatus;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
  provider: AiProviderName;
}

export type ChatPaginationParams = PaginationParams;
