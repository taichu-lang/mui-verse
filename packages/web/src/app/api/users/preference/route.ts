"server-only";

import { getAuthSession } from "@/lib/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const response = await fetch(`${serverUrl}/v1/users/preference`, {
    method: "GET",
    headers: await getAuthSession(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to get user preference.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const auth = await getAuthSession();
  const response = await fetch(`${serverUrl}/v1/users/preference`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: await request.text(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to set user preference.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const auth = await getAuthSession();
  const response = await fetch(`${serverUrl}/v1/users/preference`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...auth },
    body: await request.text(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to delete user preference.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}
