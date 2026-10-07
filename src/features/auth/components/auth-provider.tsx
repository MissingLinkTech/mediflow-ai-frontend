"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { queryKeys } from "@/constants/query-keys";
import { refreshAccessToken } from "@/lib/api/client";
import { tokenStore } from "@/lib/api/token-store";
import { authApi } from "../api/auth.api";
import type { AuthPayload, AuthStatus } from "../types/auth.types";

interface AuthContextValue {
  status: AuthStatus;
  establishSession: (payload: AuthPayload) => void;
  endSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("initializing");
  const queryClient = useQueryClient();

  const endSession = useCallback(() => {
    tokenStore.set(null);
    queryClient.removeQueries({ queryKey: queryKeys.account.all });
    setStatus("unauthenticated");
  }, [queryClient]);

  const establishSession = useCallback(
    (payload: AuthPayload) => {
      tokenStore.set(payload.accessToken);
      queryClient.setQueryData(queryKeys.account.profile(), payload.user);
      setStatus("authenticated");
    },
    [queryClient],
  );

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        await refreshAccessToken();
        const user = await queryClient.fetchQuery({
          queryKey: queryKeys.account.profile(),
          queryFn: authApi.profile,
        });
        if (active && user) setStatus("authenticated");
      } catch {
        if (active) endSession();
      }
    }
    void bootstrap();
    const onExpired = () => endSession();
    window.addEventListener("mediflow:auth-expired", onExpired);
    return () => {
      active = false;
      window.removeEventListener("mediflow:auth-expired", onExpired);
    };
  }, [endSession, queryClient]);

  return (
    <AuthContext.Provider value={{ status, establishSession, endSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
