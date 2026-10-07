import { BACKEND_ENDPOINTS } from "@/constants/api";
import { backendFetch, passthrough } from "@/lib/api/server";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization)
    return Response.json(
      { success: false, statusCode: 401, message: "Authentication required" },
      { status: 401 },
    );
  return passthrough(
    await backendFetch(BACKEND_ENDPOINTS.account.profile, {
      headers: { Authorization: authorization },
    }),
  );
}
