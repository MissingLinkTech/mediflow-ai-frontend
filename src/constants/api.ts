export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
  },
  account: { profile: "/api/account/profile" },
} as const;

export const BACKEND_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh_token",
    logout: "/auth/logout",
  },
  account: { profile: "/account/profile" },
} as const;

export const REFRESH_COOKIE_NAME = "mediflow_refresh";
