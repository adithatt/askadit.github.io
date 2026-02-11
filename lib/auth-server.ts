import { NextRequest } from "next/server";

const COOKIE_NAME = "askadit_auth";

export function isAuthenticatedRequest(request: NextRequest): boolean {
  return request.cookies.get(COOKIE_NAME)?.value === "true";
}
