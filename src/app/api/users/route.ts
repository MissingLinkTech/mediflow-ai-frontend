import { BACKEND_ENDPOINTS } from "@/constants/api";
import { forwardAuthorizedRequest } from "@/lib/api/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return forwardAuthorizedRequest(request, `${BACKEND_ENDPOINTS.users.list}${url.search}`);
}
