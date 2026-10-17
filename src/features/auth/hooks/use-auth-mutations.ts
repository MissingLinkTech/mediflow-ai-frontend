"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuth } from "../components/auth-provider";

export function useLogin() {
  const { establishSession } = useAuth();
  return useMutation({ mutationFn: authApi.login, onSuccess: establishSession });
}

export function useSignup() {
  const { establishSession } = useAuth();
  return useMutation({ mutationFn: authApi.signup, onSuccess: establishSession });
}

export function useLogout() {
  const { endSession } = useAuth();
  // Wrap explicitly: TanStack passes (data, error, ...) to onSettled, which
  // must not leak into endSession's reason parameter.
  return useMutation({ mutationFn: authApi.logout, onSettled: () => endSession("signed-out") });
}
