import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "ahattikudur";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "test123";
const COOKIE_NAME = "askadit_auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ success: true });
      res.cookies.set(COOKIE_NAME, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return res;
    }
    return NextResponse.json({ success: false }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
