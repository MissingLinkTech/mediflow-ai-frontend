"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  type FormEvent,
} from "react";
import { AlertCircle, ArrowUp, Sparkles } from "lucide-react";
import { sendMessageSchema } from "../schemas/chat.schemas";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isPending: boolean;
  disabled?: boolean;
  initialValue?: string;
  errorMessage?: string | null;
  onDismissError?: () => void;
}

export interface MessageInputHandle {
  focus: () => void;
  reset: () => void;
}

export const MessageInput = forwardRef<MessageInputHandle, MessageInputProps>(function MessageInput(
  { onSendMessage, isPending, disabled, initialValue = "", errorMessage, onDismissError },
  ref,
) {
  const [content, setContent] = useState(initialValue);
  const [prevInitial, setPrevInitial] = useState(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => textareaRef.current?.focus(),
      reset: () => {
        setContent("");
        setValidationError(null);
        if (textareaRef.current) {
          textareaRef.current.style.height = "44px";
          textareaRef.current.focus();
        }
      },
    }),
    [],
  );

  if (initialValue !== prevInitial) {
    setPrevInitial(initialValue);
    setContent(initialValue);
  }

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 160);
    el.style.height = `${Math.max(nextHeight, 44)}px`;
  }, [content]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 160);
    el.style.height = `${Math.max(nextHeight, 44)}px`;
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = e.target.value;
    setContent(nextValue);

    if (validationError) {
      const result = sendMessageSchema.safeParse({ content: nextValue });
      if (result.success) setValidationError(null);
    }

    adjustHeight();
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (isPending || disabled) return;

    const trimmed = content.trim();
    const result = sendMessageSchema.safeParse({ content: trimmed });
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Invalid message");
      return;
    }

    setValidationError(null);
    onSendMessage(trimmed);
    setContent("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isOverLimit = content.length > 20000;
  const canSend = content.trim().length > 0 && !isOverLimit && !isPending && !disabled;

  return (
    <form onSubmit={handleSubmit} className="chat-input-area" noValidate>
      {(validationError || errorMessage) && (
        <div
          className="chat-input-error"
          role={validationError ? "alert" : "status"}
          aria-live="polite"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          <p>{validationError ?? errorMessage}</p>
          {errorMessage && onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              className="chat-input-error__dismiss"
              aria-label="Dismiss error"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="chat-input-shell">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={isPending || disabled}
          placeholder="Ask a health question or describe symptoms…"
          rows={1}
          className="chat-input-textarea"
          aria-label="Your medical query"
        />

        <div className="chat-input-toolbar">
          <span className="chat-input-hint">
            <Sparkles className="size-3 text-[#0c766b] dark:text-[#49b8a6]" aria-hidden="true" />
            <span className="chat-input-hint-label">
              MediFlow AI selects the best model for you
            </span>
          </span>

          <div className="chat-input-actions">
            <span
              className={`chat-input-counter ${isOverLimit ? "chat-input-counter--over" : ""}`}
              aria-live="polite"
            >
              {content.length > 500 ? `${content.length}/20000` : ""}
            </span>

            <button
              type="submit"
              disabled={!canSend}
              className="chat-input-send"
              aria-label="Send message"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
});
