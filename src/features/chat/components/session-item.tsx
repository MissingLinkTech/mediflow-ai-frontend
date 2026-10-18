"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import { Archive, ArchiveRestore, Check, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import type { ChatSession, ChatStatus } from "../types/chat.types";
import { SessionTypeIcon } from "./session-type-icon";

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onRename: (id: string, newTitle: string) => void;
  onArchiveToggle: (id: string, newStatus: ChatStatus) => void;
  onDelete: (id: string) => void;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function SessionItem({
  session,
  isActive,
  onSelect,
  onRename,
  onArchiveToggle,
  onDelete,
}: SessionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(e: globalThis.MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSaveRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== (session.title ?? "")) {
      onRename(session.id, trimmed);
    } else {
      setEditTitle(session.title ?? "");
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditTitle(session.title ?? "");
    setIsEditing(false);
  };

  const toggleMenu = (e: MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const isArchived = session.status === "archived";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
        isActive
          ? "bg-[#eaf6f2] font-semibold text-[#075e56] shadow-2xs dark:bg-[#142e29] dark:text-[#5cc5b4]"
          : "text-[#254e49] hover:bg-[#f2f8f6] dark:text-[#c4ded9] dark:hover:bg-white/5"
      }`}
    >
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
          isActive
            ? "bg-[#0c766b] text-white dark:bg-[#49b8a6] dark:text-[#0b1514]"
            : "bg-[#edf4f2] text-[#637d79] group-hover:bg-[#dff0ea] dark:bg-[#182d29] dark:text-[#91aaa6]"
        }`}
      >
        <SessionTypeIcon type={session.type} />
      </div>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveRename();
                if (e.key === "Escape") handleCancelRename();
              }}
              className="h-7 w-full rounded-md border border-[#0c766b] bg-white px-2 text-xs text-[#153b37] outline-none dark:border-[#49b8a6] dark:bg-[#132522] dark:text-[#e4f2ef]"
            />
            <button
              type="button"
              onClick={handleSaveRename}
              className="flex size-6 items-center justify-center rounded text-[#0c766b] hover:bg-[#e0f1eb] dark:text-[#49b8a6]"
              aria-label="Confirm rename"
            >
              <Check className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCancelRename}
              className="flex size-6 items-center justify-center rounded text-[#a43e3e] hover:bg-[#fee2e2] dark:text-[#f08b8b]"
              aria-label="Cancel rename"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <>
            <p className="truncate text-xs leading-snug">
              {session.title || "Untitled consultation"}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#65807c] dark:text-[#91aaa6]">
              <span>{formatRelativeTime(session.updatedAt || session.createdAt)}</span>
              {isArchived && (
                <span className="py-0.2 rounded bg-amber-100 px-1 text-[9px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  Archived
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={toggleMenu}
            className="flex size-7 items-center justify-center rounded-md text-[#91a5a1] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/5 hover:text-[#153b37] dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Session options"
          >
            <MoreVertical className="size-3.5" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 z-30 mt-1 w-36 rounded-lg border border-[#dce9e5] bg-white py-1 shadow-lg ring-1 ring-black/5 dark:border-[#26413d] dark:bg-[#101f1d]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setIsEditing(true);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[#254e49] hover:bg-[#f1faf7] dark:text-[#c4ded9] dark:hover:bg-white/5"
              >
                <Pencil className="size-3.5" />
                <span>Rename</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onArchiveToggle(session.id, isArchived ? "active" : "archived");
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[#254e49] hover:bg-[#f1faf7] dark:text-[#c4ded9] dark:hover:bg-white/5"
              >
                {isArchived ? (
                  <>
                    <ArchiveRestore className="size-3.5" />
                    <span>Unarchive</span>
                  </>
                ) : (
                  <>
                    <Archive className="size-3.5" />
                    <span>Archive</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-[#edf4f2] dark:border-[#26413d]" />

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(session.id);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-[#a43e3e] hover:bg-red-50 dark:text-[#f08b8b] dark:hover:bg-red-950/30"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
