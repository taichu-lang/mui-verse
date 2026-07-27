"use client";

import { useConversation } from "@/hooks/useConversation";
import { usePathname } from "@/i18n/navigation";
import { ChatProvider } from "@mui-verse/ui/components/chat";
import { useEffect } from "react";

/**
 * Wraps chat pages in a session-scoped ChatProvider. The pathname keys the
 * provider — when it changes, the provider remounts, dropping messages /
 * streaming / draft state so the user gets a clean slate.
 *
 * The conversation-metadata store (title/pinned/id shown in the Navbar) is a
 * module-level zustand store, deliberately outside this remount cycle — the
 * sidebar writes to it before navigation, and we'd lose that write if it
 * remounted with the session. Reset it explicitly when landing on `/chat`.
 */
export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/chat") useConversation.getState().reset();
  }, [pathname]);

  return <ChatProvider key={pathname}>{children}</ChatProvider>;
}
