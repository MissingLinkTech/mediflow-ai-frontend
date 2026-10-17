import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
export default function AuthenticatedLayout({ children }: LayoutProps<"/app">) {
  return (
    <Suspense>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
