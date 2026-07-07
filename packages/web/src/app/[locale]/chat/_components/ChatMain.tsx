"use client";

import { ChatScrollContainerContext } from "@mui-verse/ui/components/chat";
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

  return (
    <div ref={setScrollContainer} className="flex-1 overflow-y-auto">
      <ChatScrollContainerContext.Provider value={scrollContainer}>
        <div className="flex min-h-full flex-col">{children}</div>
      </ChatScrollContainerContext.Provider>
    </div>
  );
}
