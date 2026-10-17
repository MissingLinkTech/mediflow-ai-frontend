"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { LOGIN_REDIRECT_PARAM, safeRedirectPath } from "@/constants/routes";
import { useAuth } from "./auth-provider";

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    // Already signed in: leave the auth page for the originally requested
    // destination (validated), not a hardcoded home page.
    if (status === "authenticated")
      router.replace(safeRedirectPath(searchParams.get(LOGIN_REDIRECT_PARAM)));
  }, [router, status, searchParams]);
  return children;
}
