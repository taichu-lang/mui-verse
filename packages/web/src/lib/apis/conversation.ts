import { Conversation, MessageSearch } from "@/lib/types/chat";

export async function getConversations(
  from: number,
  limit: number,
  pinned: boolean,
  signal?: AbortSignal,
): Promise<Conversation[]> {
  try {
    const params = new URLSearchParams();
    params.set("from", from.toString());
    params.set("limit", limit.toString());
    if (pinned) {
      params.set("pinned", "true");
    }

    const response = await fetch(`/api/conversations?${params}`, { signal });
    const items = (await response.json()) as Conversation[];
    return items;
  } catch {
    return [];
  }
}

export async function searchConversation(
  query: string,
  from: number,
  limit: number,
  signal?: AbortSignal,
): Promise<MessageSearch[]> {
  if (!query) {
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    from: String(from),
    limit: String(limit),
  });
  const response = await fetch(`/api/conversations/search?${params}`, {
    signal,
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as MessageSearch[];
}
