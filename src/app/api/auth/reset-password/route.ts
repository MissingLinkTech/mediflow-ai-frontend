import { BACKEND_ENDPOINTS } from "@/constants/api";
import { backendFetch, passthrough } from "@/lib/api/server";

export async function POST(request: Request) {
  const body = await request.text();
  const response = await backendFetch(BACKEND_ENDPOINTS.auth.resetPassword, {
    method: "POST",
    body,
  });
  return passthrough(response);
}
