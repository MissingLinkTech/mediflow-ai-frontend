export const chatKeys = {
  all: ["chat"] as const,
  sessions: (params?: { page?: number; limit?: number }) =>
    ["chat", "sessions", params ?? {}] as const,
  session: (id: string) => ["chat", "session", id] as const,
  messages: (sessionId: string) => ["chat", "messages", sessionId] as const,
} as const;

export const adminKeys = {
  all: ["admin"] as const,
  users: (params?: { page?: number; limit?: number }) => ["admin", "users", params ?? {}] as const,
};

export const queryKeys = {
  account: {
    all: ["account"] as const,
    profile: () => ["account", "profile"] as const,
  },
  chat: chatKeys,
  admin: adminKeys,
} as const;
