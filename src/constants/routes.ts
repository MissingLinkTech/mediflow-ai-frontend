export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  app: "/app",
} as const;

export const LOGIN_REDIRECT_PARAM = "redirect";

export function safeRedirectPath(value: string | null): string {
  return value?.startsWith("/app") && !value.startsWith("//") ? value : ROUTES.app;
}
