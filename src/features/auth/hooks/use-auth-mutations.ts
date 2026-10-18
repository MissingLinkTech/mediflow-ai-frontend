"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { authApi } from "../api/auth.api";
import { useAuth } from "../components/auth-provider";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateSettingsInput,
} from "../schemas/auth.schemas";

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

export function useForgotPassword() {
  return useMutation({ mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input) });
}

export function useResetPassword() {
  return useMutation({ mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input) });
}

export function useChangePassword() {
  return useMutation({ mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input) });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateSettingsInput) => authApi.updateSettings(input),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.account.profile(), updatedUser);
    },
  });
}
