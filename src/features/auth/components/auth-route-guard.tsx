"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "./auth-provider";

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") router.replace(ROUTES.home);
  }, [router, status]);
  return children;
}
