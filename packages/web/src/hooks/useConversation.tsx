"use client";

import { Conversation } from "@/lib/types/chat";
import { create } from "zustand";

interface ConversationValue {
  conversation: Conversation | null;
  onInit: (id: string) => void;
  setConversation: (c: Partial<Conversation>) => void;
  reset: () => void;
}

export const useConversation = create<ConversationValue>((set, get) => ({
  conversation: null,
  onInit: (id: string) =>
    set({ conversation: { id, title: "", pinned: false } }),
  setConversation: (c: Partial<Conversation>) =>
    set({ conversation: { ...get().conversation!, ...c } }),
  reset: () => set({ conversation: null }),
}));
