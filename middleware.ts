import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Exposes the current pathname to server components via the
 * `x-pathname` header (used by the admin sidebar for active states).
 * No auth logic here — pages enforce that themselves.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
