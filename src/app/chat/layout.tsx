import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function ChatRouteLayout({ children }: LayoutProps<"/chat">) {
  return (
    <Suspense>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
