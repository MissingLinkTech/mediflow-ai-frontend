export const queryKeys = {
  account: {
    all: ["account"] as const,
    profile: () => ["account", "profile"] as const,
  },
} as const;
