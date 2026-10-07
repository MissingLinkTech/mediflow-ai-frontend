import "server-only";

function requiredUrl(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(`${name} must be a valid URL`);
  }
}

export const serverEnv = {
  get apiBaseUrl() {
    return requiredUrl("API_BASE_URL");
  },
  refreshCookieMaxAge: Number(process.env.AUTH_REFRESH_COOKIE_MAX_AGE_SECONDS || 604800),
};
