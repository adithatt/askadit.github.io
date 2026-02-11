import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: isAuthenticatedRequest(request),
  });
}
