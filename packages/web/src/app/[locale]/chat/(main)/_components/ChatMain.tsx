"use client";

import { usePathname } from "@/i18n/navigation";
import {
  ChatScrollContainerContext,
  ChatSessionProvider,
} from "@mui-verse/ui/components/chat";
import { useState } from "react";

// Owns the single scroll container for the chat surface, and publishes it via
// ChatScrollContainerContext so the virtualized Conversation can bind to it
// without walking up the DOM. The inner min-h-full flex column lets Sender's
// `sticky bottom-0` pin correctly even when the conversation is empty — no
// need for a hard-coded min-h-[calc(100dvh - navbar)] on the page.
export function ChatMain({ children }: { children: React.ReactNode }) {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const pathname = usePathname();

  return (
    <div ref={setScrollContainer} className="flex-1 overflow-y-auto">
      {/*
       * Wraps chat pages in a session-scoped ChatSessionProvider. The pathname keys
       * the provider — when it changes, the provider remounts, dropping messages /
       * streaming / draft state so the user gets a clean slate.
       *
       * The conversation-metadata store (title/pinned/id shown in the Navbar) is a
       * module-level zustand store, deliberately outside this remount cycle — the
       * sidebar writes to it before navigation, and we'd lose that write if it
       * remounted with the session.
       *
       * User preferences that span conversations (model, enableWebSearch) live in
       * the module-level `useChat` store and are unaffected by this remount.
       */}
      <ChatSessionProvider key={pathname}>
        <ChatScrollContainerContext.Provider value={scrollContainer}>
          <div className="flex min-h-full flex-col">{children}</div>
        </ChatScrollContainerContext.Provider>
      </ChatSessionProvider>
    </div>
  );
}
