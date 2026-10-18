"use client";

import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock,
  Copy,
  Hash,
  RefreshCcw,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import type { AiProviderName, ChatMessage } from "../types/chat.types";
import { MarkdownContent, useCopyMarkdown } from "./markdown-content";

interface MessageItemProps {
  message: ChatMessage;
  onRetry?: () => void;
}

function getProviderBadge(provider?: AiProviderName) {
  switch (provider) {
    case "gemini":
      return {
        label: "Gemini",
        icon: Sparkles,
        className:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60",
      };
    case "groq":
      return {
        label: "Groq",
        icon: Zap,
        className:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/60",
      };
    case "openai":
      return {
        label: "OpenAI",
        icon: Bot,
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60",
      };
    default:
      return {
        label: "MediFlow AI",
        icon: Sparkles,
        className:
          "bg-[#f1faf7] text-[#0c766b] border-[#dcece7] dark:bg-[#142e29] dark:text-[#5cc5b4] dark:border-[#26413d]",
      };
  }
}

function formatTime(timestamp: string): string {
  try {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function MessageItem({ message, onRetry }: MessageItemProps) {
  const isUser = message.role === "user";
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";

  const providerBadge = getProviderBadge(message.metadata?.provider);
  const ProviderIcon = providerBadge.icon;
  const { copied, copy } = useCopyMarkdown(message);

  if (isUser) {
    return (
      <div className="flex w-full justify-end">
        <div className="msg-bubble">
          <div className="msg-bubble__body">
            <div className="msg-bubble__content">
              <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
            <span className="msg-bubble__time">{formatTime(message.createdAt)}</span>
          </div>

          <div className="msg-bubble__avatar">
            <User className="size-3.5" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-start">
      <div className="msg-row">
        <div className="msg-row__avatar">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>

        <div className="msg-row__body">
          <div className="chat-msg-card">
            {isPending ? (
              <div className="flex items-center gap-3 py-1 text-xs text-[#65807c] dark:text-[#91aaa6]">
                <div className="chat-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="msg-pending-label">
                  Analyzing medical context and generating response…
                </span>
              </div>
            ) : isFailed ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="font-semibold">Unable to generate response</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed">
                      {message.content ||
                        "An error occurred while connecting to the AI provider. Please retry your request."}
                    </p>
                  </div>
                </div>

                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#cddeda] bg-white px-3 py-1.5 text-xs font-semibold text-[#153b37] hover:bg-[#f4faf8] dark:border-[#29433f] dark:bg-[#142724] dark:text-[#e4f2ef]"
                  >
                    <RefreshCcw className="size-3" />
                    <span>Retry generation</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <MarkdownContent content={message.content} />

                <div className="msg-meta">
                  <div className="msg-meta__badges">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${providerBadge.className}`}
                    >
                      <ProviderIcon className="size-3" />
                      <span>{providerBadge.label}</span>
                    </span>

                    {message.metadata?.model && (
                      <span className="text-[10px] text-[#8aa09c] dark:text-[#76938e]">
                        {String(message.metadata.model)}
                      </span>
                    )}

                    {typeof message.metadata?.latencyMs === "number" && (
                      <span className="flex items-center gap-0.5 text-[10px] text-[#8aa09c] dark:text-[#76938e]">
                        <Clock className="size-2.5" />
                        <span>{message.metadata.latencyMs}ms</span>
                      </span>
                    )}

                    {typeof message.metadata?.tokens === "number" && (
                      <span className="flex items-center gap-0.5 text-[10px] text-[#8aa09c] dark:text-[#76938e]">
                        <Hash className="size-2.5" />
                        <span>{message.metadata.tokens} tokens</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={copy}
                    className="msg-meta__copy"
                    title={copied ? "Copied!" : "Copy message as Markdown"}
                    aria-label={copied ? "Copied message" : "Copy message as Markdown"}
                  >
                    {copied ? (
                      <CheckCircle2 className="size-3.5 text-[#0c766b] dark:text-[#49b8a6]" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <span className="msg-row__time">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
