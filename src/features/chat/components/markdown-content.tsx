"use client";

import { useCallback, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { ChatMessage } from "../types/chat.types";

const SANITIZE_SCHEMA = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-/]],
    span: [...(defaultSchema.attributes?.span ?? []), ["className"]],
  },
};

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={`chat-markdown ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, SANITIZE_SCHEMA]]}
        components={MARKDOWN_COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
  h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
  h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
  h4: ({ children }) => <h4 className="md-h4">{children}</h4>,
  p: ({ children }) => <p className="md-p">{children}</p>,
  a: ({ href, children, ...rest }) => (
    <a
      href={href}
      className="md-link"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="md-strong">{children}</strong>,
  em: ({ children }) => <em className="md-em">{children}</em>,
  ul: ({ children }) => <ul className="md-ul">{children}</ul>,
  ol: ({ children }) => <ol className="md-ol">{children}</ol>,
  li: ({ children }) => <li className="md-li">{children}</li>,
  hr: () => <hr className="md-hr" />,
  blockquote: ({ children }) => <blockquote className="md-blockquote">{children}</blockquote>,
  code: ({ className, children, ...rest }) => {
    const isInline = !(rest as { node?: { position?: unknown } }).node?.position;
    if (isInline) {
      return <code className="md-code-inline">{children}</code>;
    }
    return (
      <code className={`md-code-block ${className ?? ""}`} {...rest}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="md-pre">{children}</pre>,
  table: ({ children }) => (
    <div className="md-table-wrap">
      <table className="md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="md-thead">{children}</thead>,
  tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
  tr: ({ children }) => <tr className="md-tr">{children}</tr>,
  th: ({ children }) => <th className="md-th">{children}</th>,
  td: ({ children }) => <td className="md-td">{children}</td>,
};

/**
 * Copies the raw Markdown source of a chat message (preserving the AI's
 * formatting so it can be pasted into any markdown editor). Returns a
 * `copied` boolean and a `copy()` callback for the consumer to wire up to
 * whichever button they want.
 */
export function useCopyMarkdown(message: ChatMessage) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const payload = message.content;
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        fallbackCopy(payload);
      } else {
        await navigator.clipboard.writeText(payload);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      fallbackCopy(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [message.content]);

  return { copied, copy };
}

function fallbackCopy(text: string): void {
  if (typeof document === "undefined") return;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}
