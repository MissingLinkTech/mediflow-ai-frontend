import { BACKEND_ENDPOINTS } from "@/constants/api";
import { backendFetch, passthrough } from "@/lib/api/server";

export async function POST(request: Request) {
  const body = await request.text();
  const response = await backendFetch(BACKEND_ENDPOINTS.auth.forgotPassword, {
    method: "POST",
    body,
  });
  // Backend returns 204 No Content for forgot-password whether or not the
  // email is known, so always pass through the (empty) body and status.
  return passthrough(response);
}
