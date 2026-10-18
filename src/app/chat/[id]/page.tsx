import type { Metadata } from "next";
import { ChatLayout } from "@/features/chat/components/chat-layout";

export const metadata: Metadata = {
  title: "AI Health Chat",
  description:
    "Consult your AI medical companion for evidence-based clinical information, symptoms, and lab explanations.",
};

// The chat experience is session-gated and renders client-side after auth resolves,
// so it cannot be part of the instant-navigation prerender.
export const instant = false;

export default async function ChatSessionPage({ params }: PageProps<"/chat/[id]">) {
  const { id } = await params;

  return <ChatLayout initialSessionId={id} />;
}
