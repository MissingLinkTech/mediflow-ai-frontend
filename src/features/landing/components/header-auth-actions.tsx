"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/features/auth/components/auth-provider";

export function HeaderAuthActions() {
  const { status } = useAuth();

  if (status === "authenticated") {
    return (
      <Button asChild size="sm">
        <Link href={ROUTES.app}>
          Open workspace <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Link href={ROUTES.login} className="text-link">
        Log in
      </Link>
      <Button asChild size="sm">
        <Link href={ROUTES.signup}>
          Try MediFlow <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </>
  );
}
