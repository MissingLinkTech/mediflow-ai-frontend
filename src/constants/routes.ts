export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  chat: "/chat",
  chatSession: (id: string) => `/chat/${id}`,
  settings: "/settings",
  adminUsers: "/admin/users",
} as const;

export const LOGIN_REDIRECT_PARAM = "redirect";
export const RESET_TOKEN_PARAM = "token";

const AUTH_ROUTES = [ROUTES.login, ROUTES.signup, ROUTES.forgotPassword, ROUTES.resetPassword];

/**
 * Only trust same-origin, non-auth destinations so a crafted `redirect`
 * parameter cannot bounce the user back into the login flow or off-site.
 */
export function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return ROUTES.home;
  }
  if (AUTH_ROUTES.some((path) => value === path || value.startsWith(`${path}?`))) {
    return ROUTES.home;
  }
  return value;
}
