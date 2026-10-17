import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE_NAME } from "@/constants/api";
import { LOGIN_REDIRECT_PARAM, ROUTES } from "@/constants/routes";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(REFRESH_COOKIE_NAME)) {
    const login = new URL(ROUTES.login, request.url);
    // Preserve the full attempted destination (path + search) so a later
    // sign-in can return the user where they were headed.
    login.searchParams.set(
      LOGIN_REDIRECT_PARAM,
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/app/:path*"] };
