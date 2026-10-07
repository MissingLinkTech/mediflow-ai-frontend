import { AppShell } from "@/components/layout/app-shell";
export default function AuthenticatedLayout({ children }: LayoutProps<"/app">) {
  return <AppShell>{children}</AppShell>;
}
