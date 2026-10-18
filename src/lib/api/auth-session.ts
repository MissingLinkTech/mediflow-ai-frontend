import "server-only";
import { NextResponse } from "next/server";
import type { ApiSuccess } from "@/types/api";
import { setRefreshCookie } from "./auth-cookie";
import { passthrough } from "./server";

/**
 * Shared handling for login/signup responses: persist the refresh token in the
 * httpOnly cookie and return the auth payload with the token stripped out.
 */
export async function establishSessionFromAuthResponse<T extends { refreshToken: string }>(
  response: Response,
): Promise<Response> {
  if (!response.ok) return passthrough(response);
  const envelope = (await response.json()) as ApiSuccess<T>;
  await setRefreshCookie(envelope.data.refreshToken);
  const { refreshToken: _refreshToken, ...safeData } = envelope.data;
  void _refreshToken;
  return NextResponse.json({ ...envelope, data: safeData }, { status: response.status });
}
