import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routePermissions } from "./config/permissions";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const tokens =
    request.cookies.get("resolve-tokens")?.value ||
    request.headers.get("x-resolve-tokens");

  if (!tokens) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const userData = JSON.parse(tokens);
    const userRole = userData.role;

    for (const [restrictedPath, permission] of Object.entries(
      routePermissions
    )) {
      if (path.startsWith(restrictedPath)) {
        if (!permission.roles.includes(userRole)) {
          return NextResponse.redirect(
            new URL(permission.redirect, request.url)
          );
        }
      }
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/setup/:path*",
    // '/routes/:path*'
  ],
};
