import "server-only";
import { serverEnv } from "@/config/env.server";

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${serverEnv.apiBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
}

export function unauthorized(message = "Authentication required"): Response {
  return Response.json({ success: false, statusCode: 401, message }, { status: 401 });
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

/**
 * Forward an authenticated request to the backend, returning a 401 when the
 * caller did not supply an Authorization header. Centralizes the repeated
 * auth-extraction + passthrough pattern used by the protected BFF routes.
 */
export async function forwardAuthorizedRequest(
  request: Request,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const authorization = request.headers.get("authorization");
  if (!authorization) return unauthorized();
  return passthrough(
    await backendFetch(path, {
      ...init,
      headers: { ...init.headers, Authorization: authorization },
    }),
  );
}
