"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { SettingsView } from "@/features/settings/components/settings-view";

export default function SettingsPage() {
  return (
    <Suspense>
      <AppShell>
        <SettingsView />
        <div style={{ height: 22 }} />
        <ChangePasswordForm />
      </AppShell>
    </Suspense>
  );
}
