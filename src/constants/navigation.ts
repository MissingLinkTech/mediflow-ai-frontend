import type { UserRole } from "@/features/auth/types/auth.types";
import { ROUTES } from "./routes";

export interface NavigationItem {
  label: string;
  href?: string;
  icon: "home" | "spark" | "file" | "report" | "people" | "history" | "shield";
  roles?: UserRole[];
  comingSoon?: boolean;
}

export const APP_NAVIGATION: NavigationItem[] = [
  { label: "Overview", href: ROUTES.app, icon: "home" },
  { label: "AI health chat", icon: "spark", comingSoon: true },
  { label: "Documents", icon: "file", comingSoon: true },
  { label: "Reports", icon: "report", comingSoon: true },
  { label: "Specialists", icon: "people", comingSoon: true },
  { label: "History", icon: "history", comingSoon: true },
  { label: "Administration", icon: "shield", roles: ["admin"], comingSoon: true },
];

export function navigationForRole(role: UserRole): NavigationItem[] {
  return APP_NAVIGATION.filter((item) => !item.roles || item.roles.includes(role));
}
