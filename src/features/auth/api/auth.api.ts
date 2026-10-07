import { API_ENDPOINTS } from "@/constants/api";
import { apiRequest } from "@/lib/api/client";
import type { AuthPayload, User } from "../types/auth.types";
import type { LoginInput, SignupInput } from "../schemas/auth.schemas";

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
};
