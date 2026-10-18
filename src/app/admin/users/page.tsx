"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AdminUsersView } from "@/features/admin/components/admin-users-view";

export default function AdminUsersPage() {
  return (
    <Suspense>
      <AppShell>
        <AdminUsersView />
      </AppShell>
    </Suspense>
  );
}
