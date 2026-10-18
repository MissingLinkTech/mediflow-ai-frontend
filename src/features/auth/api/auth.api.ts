import { API_ENDPOINTS } from "@/constants/api";
import { apiRequest } from "@/lib/api/client";
import type { AuthPayload, User } from "../types/auth.types";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
  UpdateSettingsInput,
} from "../schemas/auth.schemas";

export const authApi = {
  login: (input: LoginInput) =>
    apiRequest<AuthPayload>(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  signup: (input: SignupInput) =>
    apiRequest<AuthPayload>(API_ENDPOINTS.auth.signup, {
      method: "POST",
      body: JSON.stringify({ ...input, name: input.name || undefined }),
    }),
  logout: () =>
    apiRequest<void>(API_ENDPOINTS.auth.logout, { method: "POST", auth: true, retryAuth: false }),
  profile: () => apiRequest<User>(API_ENDPOINTS.account.profile, { auth: true }),
  forgotPassword: (input: ForgotPasswordInput) =>
    apiRequest<void>(API_ENDPOINTS.auth.forgotPassword, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  resetPassword: (input: ResetPasswordInput) =>
    apiRequest<void>(API_ENDPOINTS.auth.resetPassword, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  changePassword: (input: ChangePasswordInput) =>
    apiRequest<void>(API_ENDPOINTS.account.changePassword, {
      method: "POST",
      body: JSON.stringify({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      }),
      auth: true,
    }),
  updateSettings: (input: UpdateSettingsInput) =>
    apiRequest<User>(API_ENDPOINTS.account.settings, {
      method: "PATCH",
      body: JSON.stringify(input),
      auth: true,
    }),
};
