import { cookies } from "next/headers";

const COOKIE_NAME = "askadit_auth";

export function getAdminCredentials(): { username: string; password: string } {
  return {
    username: process.env.ADMIN_USERNAME ?? "ahattikudur",
    password: process.env.ADMIN_PASSWORD ?? "test123",
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "true";
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
