import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function POST(request: NextRequest) {
  const body = await request.json();

  let apiRes: Response;
  try {
    apiRes = await fetch(`${BASE_URL}/api/v1/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the server. Please try again later." },
      { status: 503 },
    );
  }

  const data = await apiRes.json().catch(() => ({}));

  if (!apiRes.ok) {
    return NextResponse.json(
      { message: data.message ?? "Failed to send message." },
      { status: apiRes.status },
    );
  }

  return NextResponse.json(data, { status: apiRes.status });
}
