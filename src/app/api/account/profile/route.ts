import { BACKEND_ENDPOINTS } from "@/constants/api";
import { forwardAuthorizedRequest } from "@/lib/api/server";

export async function GET(request: Request) {
  return forwardAuthorizedRequest(request, BACKEND_ENDPOINTS.account.profile);
}
