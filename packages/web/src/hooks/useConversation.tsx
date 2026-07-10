"use client";

import { Conversation } from "@/lib/types/chat";
import { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

// ConversationValue is the state of newly created conversation.
interface ConversationValue {
  conversation: Conversation | null;
  onInit: (id: string) => void;
  setConversation: (conversation: Partial<Conversation>) => void;
}

const createConversationStore = () =>
  createStore<ConversationValue>((set, get) => ({
    conversation: null,
    onInit: (id: string) =>
      set({ conversation: { id, title: "", pinned: false } }),
    setConversation: (c: Partial<Conversation>) =>
      set({ conversation: { ...get().conversation!, ...c } }),
  }));

const ConversationContext = createContext<StoreApi<ConversationValue> | null>(
  null,
);

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fresh store per Provider instance — remounting the Provider (e.g. via a
  // sessionKey change on an ancestor) starts a new conversation from scratch.
  const [store] = useState(() => createConversationStore());
  return (
    <ConversationContext.Provider value={store}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation(): ConversationValue {
  const store = useContext(ConversationContext);
  if (!store) {
    throw new Error("useConversation must be used within a ConversationProvider");
  }
  return useStore(store);
}
