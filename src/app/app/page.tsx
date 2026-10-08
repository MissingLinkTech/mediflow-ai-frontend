import type { Metadata } from "next";
import { DashboardFoundation } from "@/features/dashboard/components/dashboard-foundation";
export const metadata: Metadata = { title: "Workspace" };
// The workspace is session-gated and renders client-side after auth resolves,
// so it cannot be part of the instant-navigation prerender.
export const instant = false;
export default function AppPage() {
  return <DashboardFoundation />;
}
