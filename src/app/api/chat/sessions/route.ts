import { BACKEND_ENDPOINTS } from "@/constants/api";
import { forwardAuthorizedRequest } from "@/lib/api/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return forwardAuthorizedRequest(request, `${BACKEND_ENDPOINTS.CHAT.SESSIONS}${url.search}`);
}

export async function POST(request: Request) {
  return forwardAuthorizedRequest(request, BACKEND_ENDPOINTS.CHAT.SESSIONS, {
    method: "POST",
    body: await request.text(),
  });
}
