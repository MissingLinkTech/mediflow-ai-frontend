import { BACKEND_ENDPOINTS } from "@/constants/api";
import { forwardAuthorizedRequest } from "@/lib/api/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return forwardAuthorizedRequest(request, BACKEND_ENDPOINTS.CHAT.SESSION_BY_ID(id));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return forwardAuthorizedRequest(request, BACKEND_ENDPOINTS.CHAT.SESSION_BY_ID(id), {
    method: "PATCH",
    body: await request.text(),
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return forwardAuthorizedRequest(request, BACKEND_ENDPOINTS.CHAT.SESSION_BY_ID(id), {
    method: "DELETE",
  });
}
