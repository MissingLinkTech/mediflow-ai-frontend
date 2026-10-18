import { BACKEND_ENDPOINTS } from "@/constants/api";
import type { AuthPayload } from "@/features/auth/types/auth.types";
import { establishSessionFromAuthResponse } from "@/lib/api/auth-session";
import { backendFetch } from "@/lib/api/server";

export async function POST(request: Request) {
  const response = await backendFetch(BACKEND_ENDPOINTS.auth.login, {
    method: "POST",
    body: await request.text(),
  });
  return establishSessionFromAuthResponse<AuthPayload & { refreshToken: string }>(response);
}
