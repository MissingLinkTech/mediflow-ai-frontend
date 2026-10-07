export type UserRole = "user" | "admin";

export interface UserSettings {
  displayName?: string;
  locale?: string;
  timezone?: string;
  notificationEmails?: boolean;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt: string | null;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
}
export type AuthStatus = "initializing" | "authenticated" | "unauthenticated";
