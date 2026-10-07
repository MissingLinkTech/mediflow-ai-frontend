import { NextResponse } from "next/server";
import { BACKEND_ENDPOINTS } from "@/constants/api";
import type { AuthPayload } from "@/features/auth/types/auth.types";
import { setRefreshCookie } from "@/lib/api/auth-cookie";
import { backendFetch, passthrough } from "@/lib/api/server";
import type { ApiSuccess } from "@/types/api";

export async function POST(request: Request) {
  const response = await backendFetch(BACKEND_ENDPOINTS.auth.signup, {
    method: "POST",
    body: await request.text(),
  });
  if (!response.ok) return passthrough(response);
  const envelope = (await response.json()) as ApiSuccess<AuthPayload & { refreshToken: string }>;
  await setRefreshCookie(envelope.data.refreshToken);
  const { refreshToken: _, ...safeData } = envelope.data;
  void _;
  return NextResponse.json({ ...envelope, data: safeData }, { status: response.status });
}
