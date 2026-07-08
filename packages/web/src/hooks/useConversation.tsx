import { Conversation } from "@/lib/types/chat";
import { create } from "zustand";

// ConversationValue is the state of newly created conversation.
interface ConversationValue {
  conversation: Conversation | null;
  onInit: (id: string) => void;
  setConversation: (conversation: Partial<Conversation>) => void;
}

export const useConversation = create<ConversationValue>((set, get) => ({
  conversation: null,
  onInit: (id: string) =>
    set({ conversation: { id, title: "", pinned: false } }),
  setConversation: (c: Partial<Conversation>) =>
    set({ conversation: { ...get().conversation!, ...c } }),
}));
