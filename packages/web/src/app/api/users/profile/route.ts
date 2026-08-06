"server-only";

import { getAuthSession } from "@/lib/cookie";
import { NextRequest, NextResponse } from "next/server";

// update user's name.
export async function PUT(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const auth = await getAuthSession();
  const response = await fetch(`${serverUrl}/v1/users/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...auth },
    body: await request.text(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to modify user profile.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}

// get user's profile, includes subscription.
export async function GET() {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const auth = await getAuthSession();
  const response = await fetch(`${serverUrl}/v1/users/profile`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...auth },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to modify user profile.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}
