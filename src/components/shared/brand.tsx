import Link from "next/link";
import { Plus } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href={ROUTES.home} className="brand" aria-label="MediFlow AI home">
      <span className="brand__mark" aria-hidden="true">
        <Plus size={19} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span>
          MediFlow <b>AI</b>
        </span>
      )}
    </Link>
  );
}
