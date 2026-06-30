"server-only";

import type { NextRequest } from "next/server";

const messages = [
  "`useOptimistic` 是 React 19 引入的一个新 Hook，核心作用是实现乐观更新（Optimistic UI）。",
  "简单来说，它允许你在异步操作（如 API 请求）完成之前，立即在界面上展示预期的结果，",
  "从而消除用户的等待感。如果异步操作最终失败，它会自动回滚到之前的状态。\n",
  "在没有 useOptimistic 之前，典型的提交流程是这样的：",
  "用户点击发送 → 显示 Loading → 等待 API 返回 → 更新列表\n",
  "```html\n",
  '<div class="user:bg-blue-500 user:text-white">User Content</div>\n',
  "```\n",
];

const encoder = new TextEncoder();

function sseEvent(data: unknown) {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(_request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        sseEvent({
          type: "meta",
          message_id: crypto.randomUUID(),
          next_assistant_id: crypto.randomUUID(),
        }),
      );

      for (const msg of messages) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        controller.enqueue(sseEvent({ type: "chunk", content: msg }));
      }

      controller.enqueue(sseEvent({ type: "done" }));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
