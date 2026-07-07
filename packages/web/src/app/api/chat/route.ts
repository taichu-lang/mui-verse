"server-only";

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) {
    return new Response("SERVER_URL is not configured", { status: 500 });
  }

  const upstream = await fetch(`${serverUrl}/v1/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
    signal: request.signal,
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return new Response(text || "Upstream error", { status: upstream.status });
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
