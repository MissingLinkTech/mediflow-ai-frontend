import "server-only";
import { serverEnv } from "@/config/env.server";

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${serverEnv.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
}

export async function passthrough(response: Response): Promise<Response> {
  const body = response.status === 204 ? null : await response.text();
  return new Response(body, {
    status: response.status,
    headers: body
      ? { "Content-Type": response.headers.get("content-type") || "application/json" }
      : undefined,
  });
}
