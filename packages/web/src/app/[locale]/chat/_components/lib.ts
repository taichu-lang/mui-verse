"server-only";

import { getAuthSession } from "@/lib/cookie";
import { logger } from "@/lib/logger";
import {
  Conversation,
  ConversationMessagesResponse,
  ConversationResponse,
} from "@/lib/types/chat";
import type { Message } from "@mui-verse/ui/components/chat";

export interface MessagesPage {
  messages: Message[];
  has_more: boolean;
}

// Server-side initial-page fetch. `before` is omitted for the first page so
// the backend returns the newest window. Returns null on any non-200 —
// callers should render the empty state rather than crashing:
// - The /chat -> /chat/<id> transition races the DB write; a 404 here is
//   expected, and the client store already has the just-streamed messages.
// - A user pasting a bogus id also lands here; the empty state is acceptable.
export async function fetchMessagesPage(
  conversationId: string,
  before?: string,
): Promise<MessagesPage | null> {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) return null;

  const limit = 30;
  const url = new URL(
    `${serverUrl}/v1/conversations/${conversationId}/messages`,
  );
  url.searchParams.set("limit", limit.toString());
  if (before) url.searchParams.set("before", before);

  const client = await fetch(url, {
    method: "GET",
    headers: await getAuthSession(),
    cache: "no-store",
  });

  if (!client.ok) {
    logger.error(
      { conversation: conversationId, status: client.status },
      "failed to load initial messages page.",
    );
    return null;
  }

  const response = (await client.json()) as ConversationMessagesResponse;
  if (response.code !== 0) {
    logger.error(
      { code: response.code },
      "failed to load initial messages page.",
    );
    return null;
  }

  return {
    messages: response.data,
    has_more: response.data.length === limit,
  };
}

export async function getConversation(
  conversationId: string,
): Promise<Conversation | null> {
  const serverUrl = process.env.SERVER_URL;
  if (!serverUrl) return null;

  const url = new URL(`${serverUrl}/v1/conversations/${conversationId}`);
  const client = await fetch(url, {
    method: "GET",
    headers: await getAuthSession(),
  });

  if (!client.ok) {
    logger.error(
      { conversation: conversationId, status: client.status },
      "failed to get conversation.",
    );
    return null;
  }

  const response = (await client.json()) as ConversationResponse;
  if (response.code !== 0) {
    logger.error({ code: response.code }, "failed to get conversation.");
    return null;
  }

  return response.data;
}
