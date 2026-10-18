import { BACKEND_ENDPOINTS } from "@/constants/api";
import { forwardAuthorizedRequest } from "@/lib/api/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const url = new URL(request.url);
  return forwardAuthorizedRequest(request, `${BACKEND_ENDPOINTS.CHAT.MESSAGES(id)}${url.search}`);
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return forwardAuthorizedRequest(request, BACKEND_ENDPOINTS.CHAT.MESSAGES(id), {
    method: "POST",
    body: await request.text(),
  });
}
