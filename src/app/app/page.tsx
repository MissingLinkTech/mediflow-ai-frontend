import type { Metadata } from "next";
import { DashboardFoundation } from "@/features/dashboard/components/dashboard-foundation";
export const metadata: Metadata = { title: "Workspace" };
export default function AppPage() {
  return <DashboardFoundation />;
}
