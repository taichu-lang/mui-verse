"server-only";

import { getAuthSession } from "@/lib/cookie";
import { NextRequest, NextResponse } from "next/server";

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
  const response = await fetch(`${serverUrl}/v1/conversations/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: await request.text(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to modify conversation.", text);
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

  const response = await fetch(`${serverUrl}/v1/conversations/${slug}`, {
    method: "DELETE",
    headers: await getAuthSession(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log("failed to delete conversation.", text);
    return NextResponse.error();
  }

  const data = await response.json();
  return NextResponse.json(data);
}
