"use client";

import { useMemo, useState } from "react";
import { MessageSquarePlus, Plus, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatSession, ChatStatus } from "../types/chat.types";
import { SessionItem } from "./session-item";

interface SessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onArchiveToggle: (id: string, newStatus: ChatStatus) => void;
  onDeleteSession: (id: string) => void;
}

export function SessionList({
  sessions,
  activeSessionId,
  isLoading,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onArchiveToggle,
  onDeleteSession,
}: SessionListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    if (!searchQuery.trim()) return sorted;

    const query = searchQuery.toLowerCase();
    return sorted.filter((s) => (s.title ?? "Untitled consultation").toLowerCase().includes(query));
  }, [sessions, searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="chat-sidebar__header">
        <button
          type="button"
          onClick={onNewChat}
          className="chat-sidebar__new"
          aria-label="Start a new consultation (clears the current chat)"
          title="Start a new consultation"
        >
          <span className="chat-sidebar__new-icon" aria-hidden="true">
            <Plus className="size-4" />
          </span>
          <span className="chat-sidebar__new-label">New consultation</span>
          <span className="chat-sidebar__new-kbd" aria-hidden="true">
            ⌘N
          </span>
        </button>

        <div className="chat-sidebar__search relative">
          <Sparkles className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#91a5a1]" />
          <input
            type="text"
            placeholder="Search consultations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 w-full rounded-lg border border-[#dce9e5] bg-[#fbfcf9] pr-3 pl-8.5 text-xs text-[#153b37] transition-colors outline-none placeholder:text-[#91a5a1] focus:border-[#0c766b] focus:bg-white dark:border-[#26413d] dark:bg-[#142724] dark:text-[#e4f2ef] dark:focus:border-[#49b8a6]"
          />
        </div>
      </div>

      <div className="chat-sidebar__list">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <Skeleton className="size-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-2 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#edf4f2] text-[#8aa09c] dark:bg-[#182d29] dark:text-[#6a8782]">
              <MessageSquarePlus className="size-5" />
            </div>
            <p className="mt-3 text-xs font-semibold text-[#254e49] dark:text-[#c4ded9]">
              {searchQuery ? "No matching chats" : "No consultations yet"}
            </p>
            <p className="mt-1 text-[11px] text-[#8aa09c] dark:text-[#76938e]">
              {searchQuery ? "Try a different search term." : "Tap the button above to begin."}
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isActive={session.id === activeSessionId}
              onSelect={() => onSelectSession(session.id)}
              onRename={onRenameSession}
              onArchiveToggle={onArchiveToggle}
              onDelete={onDeleteSession}
            />
          ))
        )}
      </div>

      <div className="chat-sidebar__footer">
        <Sparkles className="size-3.5 text-[#0c766b] dark:text-[#49b8a6]" />
        <span>AI-powered clinical reasoning</span>
      </div>
    </div>
  );
}
