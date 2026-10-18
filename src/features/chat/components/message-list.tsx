"use client";

import { useEffect, useMemo, useRef } from "react";
import { ShieldAlert } from "lucide-react";
import { dedupeById } from "@/lib/utils";
import type { ChatMessage } from "../types/chat.types";
import { MessageItem } from "./message-item";

interface MessageListProps {
  messages: ChatMessage[];
  onRetryMessage?: (message: ChatMessage) => void;
}

export function MessageList({ messages, onRetryMessage }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Defensive de-dup: the optimistic update + post-mutation refetch can race
  // and write the same server message into the cache twice. Collapsing by id
  // here keeps the React keys unique without throwing away the freshest copy.
  const uniqueMessages = useMemo(() => dedupeById(messages), [messages]);

  const lastMessage = uniqueMessages[uniqueMessages.length - 1];
  const lastMessageContent = lastMessage?.content;
  const lastMessageStatus = lastMessage?.status;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uniqueMessages.length, lastMessageContent, lastMessageStatus]);

  return (
    <div ref={containerRef} className="chat-messages-container">
      {/* Prominent safety disclaimer banner */}
      <div className="chat-disclaimer-banner">
        <ShieldAlert className="size-4 shrink-0 text-[#a0680a] dark:text-[#f7d58a]" />
        <p>
          <strong className="font-semibold">Clinical Guidance Notice:</strong> MediFlow provides
          educational health information, not medical diagnoses. Always consult a licensed clinician
          for medical decisions or immediate symptoms.
        </p>
      </div>

      {uniqueMessages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onRetry={onRetryMessage ? () => onRetryMessage(message) : undefined}
        />
      ))}

      <div ref={bottomRef} className="h-1 w-full" aria-hidden="true" />
    </div>
  );
}
