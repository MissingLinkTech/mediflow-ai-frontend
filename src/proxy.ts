import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE_NAME } from "@/constants/api";
import { ROUTES } from "@/constants/routes";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(REFRESH_COOKIE_NAME)) {
    const login = new URL(ROUTES.login, request.url);
    login.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/app/:path*"] };
