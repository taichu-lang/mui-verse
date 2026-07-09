"server-only";

import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession } from "@/lib/cookie";

export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return NextResponse.error();
  }

  const auth = await getAuthSession();

  const upstream = await fetch(`${serverUrl}/v1/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: await request.text(),
    signal: request.signal,
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    console.log("failed to send sse event.", text);
    return NextResponse.error();
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
