"server-only";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const response = await fetch(`${serverUrl}/v1/users/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to signin.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}
