"use client";

import { useMemo, useState, useCallback, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, PanelLeftClose, PanelLeftOpen, Plus, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { errorMessage as formatError } from "@/lib/api/error";
import { useChatSessions, useChatSession } from "../hooks/use-chat-sessions";
import { useChatMessages } from "../hooks/use-chat-messages";
import {
  useCreateSession,
  useSendMessage,
  useUpdateSession,
  useDeleteSession,
} from "../hooks/use-chat-mutations";
import type { ChatMessage, ChatStatus } from "../types/chat.types";
import { SessionList } from "./session-list";
import { MessageList } from "./message-list";
import { MessageInput, type MessageInputHandle } from "./message-input";
import { EmptyChatState } from "./empty-chat-state";
import { SessionTypeIcon } from "./session-type-icon";
import "../styles/chat.scss";

interface ChatLayoutProps {
  initialSessionId?: string | null;
}

export function ChatLayout({ initialSessionId = null }: ChatLayoutProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeSessionId, setActiveSessionId] = useState<string | null>(initialSessionId);
  const [lastInitialSessionId, setLastInitialSessionId] = useState<string | null>(initialSessionId);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [pendingPrompt, setPendingPrompt] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [emptyPulse, setEmptyPulse] = useState(0);

  const inputRef = useRef<MessageInputHandle>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Sync local state when the URL-driven initial id changes between renders
  // (e.g. deep link or in-page navigation). React's recommended pattern is to
  // compare during render and queue the state update; this avoids the cascading
  // render that `useEffect` would cause.
  if (initialSessionId !== lastInitialSessionId) {
    setLastInitialSessionId(initialSessionId);
    setActiveSessionId(initialSessionId);
    setPendingPrompt("");
  }

  const { data: sessionsData, isLoading: sessionsLoading } = useChatSessions();
  const sessions = useMemo(() => sessionsData?.items ?? [], [sessionsData]);

  // Fetch the active session directly so deep links resolve even when the id
  // falls outside the loaded page of the session list.
  const { data: activeSessionData } = useChatSession(activeSessionId);
  const activeSession =
    activeSessionData ?? sessions.find((session) => session.id === activeSessionId) ?? null;

  const { data: messagesData, isLoading: messagesLoading } = useChatMessages(activeSessionId);
  const messages = useMemo(() => messagesData?.items ?? [], [messagesData]);

  const createSession = useCreateSession();
  const sendMessage = useSendMessage();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  /**
   * Resets the active session and routes back to the bare /chat page so the
   * empty state (starter prompts) is shown again. Always provides visible
   * feedback by scrolling the body to the top, resetting the input, and
   * bumping the empty-state pulse so the click is never silent, even when
   * the user is already on /chat with no active session.
   */
  const handleNewChat = useCallback(() => {
    const wasActive = activeSessionId;
    const onChatRoot = typeof window !== "undefined" && window.location.pathname === ROUTES.chat;
    setActiveSessionId(null);
    setPendingPrompt("");
    setInputError(null);
    setMobileSidebarOpen(false);
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setEmptyPulse((value) => value + 1);
    inputRef.current?.reset();
    if (wasActive || !onChatRoot) {
      startTransition(() => {
        router.push(ROUTES.chat);
      });
    }
  }, [activeSessionId, router]);

  const navigateToSession = useCallback(
    (id: string | null) => {
      setActiveSessionId(id);
      setMobileSidebarOpen(false);
      setPendingPrompt("");
      bodyRef.current?.scrollTo({ top: 0 });
      startTransition(() => {
        router.push(id ? ROUTES.chatSession(id) : ROUTES.chat);
      });
    },
    [router],
  );

  const toggleDesktopSidebar = useCallback(() => {
    setDesktopSidebarOpen((prev) => !prev);
  }, []);

  // Cmd/Ctrl+N anywhere in the chat kicks off a fresh consultation.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isMeta = event.metaKey || event.ctrlKey;
      if (isMeta && (event.key === "n" || event.key === "N")) {
        const target = event.target as HTMLElement | null;
        const isEditable =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable;
        if (isEditable) return;
        event.preventDefault();
        handleNewChat();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNewChat]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      setInputError(null);
      let sessionId = activeSessionId;

      if (!sessionId) {
        try {
          const generatedTitle =
            content.length > 40 ? `${content.slice(0, 40).trim()}…` : content.trim();
          const newSession = await createSession.mutateAsync({
            title: generatedTitle,
            type: "health_consultation",
          });
          sessionId = newSession.id;
          navigateToSession(sessionId);
        } catch (error) {
          setInputError(formatError(error));
          return;
        }
      }

      sendMessage.mutate(
        { sessionId, content },
        {
          onError: (error) => {
            setInputError(formatError(error));
          },
        },
      );
    },
    [activeSessionId, createSession, navigateToSession, sendMessage],
  );

  /**
   * Starter prompts create a brand-new consultation and dispatch the prompt
   * to the AI in one click so the user lands inside a populated chat.
   */
  const handleStartWithPrompt = useCallback(
    async (prompt: string) => {
      setInputError(null);
      try {
        const generatedTitle =
          prompt.length > 40 ? `${prompt.slice(0, 40).trim()}…` : prompt.trim();
        const newSession = await createSession.mutateAsync({
          title: generatedTitle,
          type: "health_consultation",
        });
        sendMessage.mutate(
          { sessionId: newSession.id, content: prompt },
          {
            onError: (error) => {
              setInputError(formatError(error));
            },
          },
        );
        navigateToSession(newSession.id);
      } catch (error) {
        setInputError(formatError(error));
      }
    },
    [createSession, navigateToSession, sendMessage],
  );

  const handleRetryMessage = useCallback(
    (message: ChatMessage) => {
      if (!activeSessionId) return;
      const previousUserMessage = [...messages]
        .reverse()
        .find(
          (item) => item.role === "user" && new Date(item.createdAt) <= new Date(message.createdAt),
        );

      if (previousUserMessage) {
        sendMessage.mutate({
          sessionId: activeSessionId,
          content: previousUserMessage.content,
        });
      }
    },
    [activeSessionId, messages, sendMessage],
  );

  const handleRename = useCallback(
    (id: string, newTitle: string) => {
      updateSession.mutate({ id, title: newTitle });
    },
    [updateSession],
  );

  const handleArchiveToggle = useCallback(
    (id: string, newStatus: ChatStatus) => {
      updateSession.mutate({ id, status: newStatus });
    },
    [updateSession],
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (!window.confirm("Are you sure you want to delete this consultation history?")) return;
      deleteSession.mutate(id, {
        onSuccess: () => {
          if (activeSessionId === id) handleNewChat();
        },
      });
    },
    [deleteSession, activeSessionId, handleNewChat],
  );

  const isGenerating = sendMessage.isPending || createSession.isPending;
  const showEmptyState = !activeSessionId || messages.length === 0;

  return (
    <div className="chat-shell" data-collapsed={!desktopSidebarOpen}>
      {mobileSidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setMobileSidebarOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setMobileSidebarOpen(false);
          }}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        id="chat-sidebar"
        className={`chat-sidebar ${mobileSidebarOpen ? "is-open" : ""}`}
        aria-hidden={!desktopSidebarOpen && !mobileSidebarOpen}
      >
        <SessionList
          sessions={sessions}
          activeSessionId={activeSessionId}
          isLoading={sessionsLoading}
          onSelectSession={navigateToSession}
          onNewChat={handleNewChat}
          onRenameSession={handleRename}
          onArchiveToggle={handleArchiveToggle}
          onDeleteSession={handleDelete}
        />
      </aside>

      <section className="chat-main">
        <header className="chat-header">
          <div className="chat-header__left">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-[#dce9e5] text-[#153b37] hover:bg-[#f1faf7] md:hidden dark:border-[#26413d] dark:text-[#e4f2ef]"
              aria-label="Open sessions list"
            >
              <Menu className="size-4" />
            </button>

            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="chat-header__toggle"
              aria-label={
                desktopSidebarOpen ? "Hide consultations sidebar" : "Show consultations sidebar"
              }
              aria-expanded={desktopSidebarOpen}
              aria-controls="chat-sidebar"
              title={desktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {desktopSidebarOpen ? (
                <PanelLeftClose className="size-4" aria-hidden="true" />
              ) : (
                <PanelLeftOpen className="size-4" aria-hidden="true" />
              )}
            </button>

            <div className="chat-header__divider" aria-hidden="true" />

            <div className="chat-header__title">
              <div className="chat-header__avatar">
                <SessionTypeIcon type={activeSession?.type} />
              </div>
              <div className="chat-header__meta">
                <div className="chat-header__title-row">
                  <h1 className="chat-header__title-text">
                    {activeSession?.title?.trim() || "New health consultation"}
                  </h1>
                  <span
                    className={`chat-header__badge ${
                      activeSession ? "chat-header__badge--active" : "chat-header__badge--new"
                    }`}
                  >
                    <i />
                    {activeSession ? "Active" : "New"}
                  </span>
                </div>
                <p className="chat-header__subtitle">
                  {activeSession?.type
                    ? activeSession.type.replace(/_/g, " ")
                    : "Private & encrypted health dialogue"}
                </p>
              </div>
            </div>
          </div>

          <div className="chat-header__right">
            <div className="chat-header__meta-pill" aria-label="Privacy status">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              <span>Encrypted</span>
            </div>
            <button
              type="button"
              onClick={handleNewChat}
              className="chat-header__new"
              aria-label="Start a new consultation"
              title="Start a new consultation (clears the current chat)"
            >
              <span className="chat-header__new-icon" aria-hidden="true">
                <Plus className="size-3.5" />
              </span>
              <span>New consultation</span>
              <kbd className="chat-header__new-kbd" aria-hidden="true">
                ⌘N
              </kbd>
            </button>
          </div>
        </header>

        <div ref={bodyRef} className="chat-main__body" data-pulse={emptyPulse}>
          {showEmptyState ? (
            <EmptyChatState
              onSelectPrompt={(prompt) => {
                setPendingPrompt(prompt);
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
              onStartChat={handleNewChat}
              onStartWithPrompt={handleStartWithPrompt}
            />
          ) : (
            <MessageList messages={messages} onRetryMessage={handleRetryMessage} />
          )}
        </div>

        <MessageInput
          ref={inputRef}
          onSendMessage={handleSendMessage}
          isPending={isGenerating || messagesLoading}
          initialValue={pendingPrompt}
          errorMessage={inputError}
          onDismissError={() => setInputError(null)}
        />
      </section>
    </div>
  );
}
