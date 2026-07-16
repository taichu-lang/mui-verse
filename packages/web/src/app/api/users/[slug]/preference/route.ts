"server-only";

import { getAuthSession } from "@/lib/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const { slug } = await params;

  const response = await fetch(`${serverUrl}/v1/users/${slug}/preference`, {
    method: "GET",
    headers: await getAuthSession(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to modify user profile.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const { slug } = await params;

  const auth = await getAuthSession();
  const response = await fetch(`${serverUrl}/v1/users/${slug}/preference`, {
    method: "POST",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const { slug } = await params;

  const auth = await getAuthSession();
  const response = await fetch(`${serverUrl}/v1/users/${slug}/preference`, {
    method: "DELETE",
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
