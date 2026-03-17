import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let apiRes: Response;
  try {
    apiRes = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the authentication server." },
      { status: 503 },
    );
  }

  const data = await apiRes.json().catch(() => ({}));

  if (!apiRes.ok) {
    return NextResponse.json(
      { message: data.message ?? "Invalid credentials." },
      { status: apiRes.status },
    );
  }

  const cookieOpts = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(body.rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  };

  const cookieStore = await cookies();

  // authToken — HttpOnly for server-side reads (XSS protection)
  cookieStore.set("authToken", data.token, { ...cookieOpts, httpOnly: true });

  // token — non-HttpOnly so client JS can attach it as Authorization: Bearer
  // for cross-origin API calls to the backend (different port)
  cookieStore.set("token", data.token, { ...cookieOpts, httpOnly: false });

  // userData — readable by server components for display (name, email)
  cookieStore.set(
    "userData",
    JSON.stringify({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
    }),
    { ...cookieOpts, httpOnly: false },
  );

  // Return user info (token intentionally omitted from client response)
  const { token: _omit, ...user } = data;
  return NextResponse.json(user);
}
