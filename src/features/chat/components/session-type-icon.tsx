import { FileText, MessageSquare, Stethoscope } from "lucide-react";
import type { ChatSession } from "../types/chat.types";

export function SessionTypeIcon({
  type,
  className = "size-4",
}: {
  type?: ChatSession["type"];
  className?: string;
}) {
  switch (type) {
    case "health_consultation":
      return <Stethoscope className={className} />;
    case "document_analysis":
      return <FileText className={className} />;
    default:
      return <MessageSquare className={className} />;
  }
}
