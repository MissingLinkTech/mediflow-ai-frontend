"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/features/auth/components/auth-provider";
import { LandingPage } from "@/features/landing/components/landing-page";
import { DashboardFoundation } from "./dashboard-foundation";

/**
 * Root landing route: signed-in members land on their workspace, everyone else
 * sees the public marketing page. The auth status starts as `initializing`, so
 * unauthenticated visitors get the landing page without waiting on the session
 * bootstrap while members transition into the authenticated shell.
 */
export function HomeView() {
  const { status } = useAuth();

  if (status === "authenticated") {
    return (
      <Suspense>
        <AppShell>
          <DashboardFoundation />
        </AppShell>
      </Suspense>
    );
  }

  return <LandingPage />;
}
