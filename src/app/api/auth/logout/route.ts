import { BACKEND_ENDPOINTS } from "@/constants/api";
import { clearRefreshCookie } from "@/lib/api/auth-cookie";
import { backendFetch, passthrough } from "@/lib/api/server";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  const response = authorization
    ? await backendFetch(BACKEND_ENDPOINTS.auth.logout, {
        method: "POST",
        headers: { Authorization: authorization },
      })
    : new Response(null, { status: 204 });
  await clearRefreshCookie();
  return passthrough(response);
}
