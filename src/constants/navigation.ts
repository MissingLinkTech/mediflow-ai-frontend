import type { UserRole } from "@/features/auth/types/auth.types";
import { ROUTES } from "./routes";

export interface NavigationItem {
  label: string;
  href?: string;
  icon: "home" | "spark" | "file" | "report" | "people" | "history" | "shield" | "settings";
  roles?: UserRole[];
  comingSoon?: boolean;
}

export const APP_NAVIGATION: NavigationItem[] = [
  { label: "Overview", href: ROUTES.home, icon: "home" },
  { label: "AI health chat", href: ROUTES.chat, icon: "spark" },
  { label: "Settings", href: ROUTES.settings, icon: "settings" },
  { label: "Documents", icon: "file", comingSoon: true },

  { label: "Reports", icon: "report", comingSoon: true },
  { label: "Specialists", icon: "people", comingSoon: true },
  { label: "History", icon: "history", comingSoon: true },
  { label: "Administration", href: ROUTES.adminUsers, icon: "shield", roles: ["admin"] },
];

export function navigationForRole(role: UserRole): NavigationItem[] {
  return APP_NAVIGATION.filter((item) => !item.roles || item.roles.includes(role));
}
