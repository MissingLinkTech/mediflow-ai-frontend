export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  account: {
    profile: "/api/account/profile",
    changePassword: "/api/account/change-password",
    settings: "/api/account/settings",
  },
  users: { list: "/api/users" },
  CHAT: {
    SESSIONS: "/api/chat/sessions",
    SESSION_BY_ID: (id: string) => `/api/chat/sessions/${id}`,
    MESSAGES: (sessionId: string) => `/api/chat/sessions/${sessionId}/messages`,
  },
} as const;

export const BACKEND_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh_token",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  account: {
    profile: "/account/profile",
    changePassword: "/account/change-password",
    settings: "/account/settings",
  },
  users: { list: "/users" },
  CHAT: {
    SESSIONS: "/chats",
    SESSION_BY_ID: (id: string) => `/chats/${id}`,
    MESSAGES: (sessionId: string) => `/chats/${sessionId}/messages`,
  },
} as const;

export const REFRESH_COOKIE_NAME = "mediflow_refresh";
