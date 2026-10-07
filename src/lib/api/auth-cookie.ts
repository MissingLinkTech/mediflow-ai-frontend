import "server-only";
import { cookies } from "next/headers";
import { REFRESH_COOKIE_NAME } from "@/constants/api";
import { serverEnv } from "@/config/env.server";

export async function setRefreshCookie(value: string): Promise<void> {
  const store = await cookies();
  store.set(REFRESH_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: serverEnv.refreshCookieMaxAge,
  });
}

export async function clearRefreshCookie(): Promise<void> {
  const store = await cookies();
  store.delete(REFRESH_COOKIE_NAME);
}

export async function getRefreshCookie(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE_NAME)?.value;
}
