import { NextResponse } from "next/server";
import { BACKEND_ENDPOINTS } from "@/constants/api";
import { clearRefreshCookie, getRefreshCookie, setRefreshCookie } from "@/lib/api/auth-cookie";
import { backendFetch, passthrough } from "@/lib/api/server";
import type { ApiSuccess } from "@/types/api";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function POST() {
  const refreshToken = await getRefreshCookie();
  if (!refreshToken)
    return NextResponse.json(
      { success: false, statusCode: 401, message: "No active session" },
      { status: 401 },
    );
  const response = await backendFetch(BACKEND_ENDPOINTS.auth.refresh, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    await clearRefreshCookie();
    return passthrough(response);
  }
  const envelope = (await response.json()) as ApiSuccess<TokenPair>;
  await setRefreshCookie(envelope.data.refreshToken);
  return NextResponse.json({ ...envelope, data: { accessToken: envelope.data.accessToken } });
}
