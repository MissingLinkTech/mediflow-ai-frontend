import { BACKEND_ENDPOINTS } from "@/constants/api";
import { forwardAuthorizedRequest } from "@/lib/api/server";

export async function POST(request: Request) {
  return forwardAuthorizedRequest(request, BACKEND_ENDPOINTS.account.changePassword, {
    method: "POST",
    body: await request.text(),
  });
}
