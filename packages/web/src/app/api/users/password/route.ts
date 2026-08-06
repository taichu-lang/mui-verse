"server-only";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// update user's password
export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const headerStore = await headers();
  const token = headerStore.get("x-token");
  if (!token) {
    return NextResponse.error();
  }

  const response = await fetch(`${serverUrl}/v1/users/password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
