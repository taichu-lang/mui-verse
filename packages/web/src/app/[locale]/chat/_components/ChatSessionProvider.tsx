"use client";

import { usePathname } from "@/i18n/navigation";
import { ConversationProvider } from "@/hooks/useConversation";
import { ChatProvider } from "@mui-verse/ui/components/chat";
import { useEffect, useRef, useState } from "react";

/**
 * Wraps chat pages in a session-scoped set of stores. The `key` on
 * `<ChatProvider>` is a session identity derived from the URL; when it
 * changes, both providers remount, dropping messages / streaming / draft state
 * so the user gets a clean slate.
 *
 * Rules (see useSessionKey):
 * - `/chat` → session id A
 * - `/chat/<X>` → session id X  (unless we just came from `/chat`, in which
 *   case A carries over — that's the "first message just created conversation
 *   X" transition, and remounting would wipe the in-flight stream).
 * - Same pathname → same session (no-op replace on model switch keeps state).
 */
export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sessionKey = useSessionKey(pathname);
  return (
    <ChatProvider key={sessionKey}>
      <ConversationProvider>{children}</ConversationProvider>
    </ChatProvider>
  );
}

function newKey(pathname: string) {
  return `${pathname}#${crypto.randomUUID()}`;
}

function useSessionKey(pathname: string): string {
  const [key, setKey] = useState(() => newKey(pathname));
  const prev = useRef(pathname);

  useEffect(() => {
    const from = prev.current;
    prev.current = pathname;
    if (from === pathname) return;

    // Exempt: /chat -> /chat/<id> is the transition triggered by the first
    // message creating a conversation. Keeping the same session preserves the
    // streaming messages already in the store.
    if (from === "/chat" && pathname.startsWith("/chat/")) return;

    setKey(newKey(pathname));
  }, [pathname]);

  return key;
}
