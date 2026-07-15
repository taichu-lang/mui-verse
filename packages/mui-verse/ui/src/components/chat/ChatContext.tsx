"use client";

import { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Message } from "./types";

// SharedState represents the state shared across sessions.
interface SharedState {
  model: string;
  enableWebSearch: boolean;
}

interface ChatValue extends SharedState {
  streaming: boolean;
  messages: Message[];
  // Pagination — only the historically-loaded prefix has ids; the tail (an
  // in-flight user/assistant pair) is id-less. `messages[0]` is always the
  // cursor source, and it is only ever a hydrated or prepended history row.
  hasMoreOlder: boolean;
  loadingOlder: boolean;

  setSharedState: (shared: Partial<SharedState>) => void;
  stopStreaming: (interrupted?: boolean) => void;
  addUserMessage: (message: Message, assistantMessageID: string) => void;
  onStream: (message_id: string, chunk: string) => void;
  replaceMessage: (message: Message) => void;
  hydrate: (messages: Message[], hasMoreOlder: boolean) => void;
  prependOlder: (messages: Message[], hasMoreOlder: boolean) => void;
  setLoadingOlder: (loading: boolean) => void;
}

// Preferences shared across sessions. Kept out of the session store so a
// per-Provider remount (new-conversation navigation) doesn't drop the choice.
const CHAT_PREFS_KEY = "chat.prefs";
const readInitialState = (): SharedState => {
  const init: SharedState = {
    model: "",
    enableWebSearch: false,
  };
  if (typeof window === "undefined") return init;
  try {
    const raw = window.localStorage.getItem(CHAT_PREFS_KEY);
    return raw ? (JSON.parse(raw) ?? init) : init;
  } catch {
    return init;
  }
};

const createChatStore = (initialState: SharedState) =>
  createStore<ChatValue>()(
    persist(
      (set, get) => ({
        model: initialState.model,
        enableWebSearch: initialState.enableWebSearch,
        streaming: false,
        messages: [],
        hasMoreOlder: false,
        loadingOlder: false,

        setSharedState: (shared: Partial<SharedState>) => {
          set({ ...shared });
        },
        stopStreaming: (interrupted?: boolean) => set({ streaming: false }),
        addUserMessage: (message: Message, assistantMessageID: string) =>
          set({
            messages: [
              ...get().messages,
              message,
              {
                message_id: assistantMessageID,
                role: "assistant",
                content: "",
              },
            ],
            streaming: true,
          }),
        onStream: (message_id: string, chunk: string) =>
          set((state) => {
            const lastMessage = state.messages[state.messages.length - 1];
            if (
              !lastMessage ||
              lastMessage.role !== "assistant" ||
              lastMessage.message_id !== message_id
            ) {
              console.warn("Not assistant message.");
              return state;
            }

            return {
              messages: [
                ...state.messages.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + chunk },
              ],
            };
          }),
        replaceMessage: (message: Message) =>
          set((state) => ({
            messages: state.messages.map((m) =>
              m.message_id === message.message_id ? message : m,
            ),
          })),
        // Called once after the initial server-fetched page arrives on the
        // client. Skips if the store already has messages — this preserves the
        // in-flight stream on the /chat -> /chat/<id> exemption, where the
        // Provider stayed mounted through the URL change and the RSC's initial
        // fetch would otherwise clobber the just-appended user/assistant pair.
        hydrate: (messages: Message[], hasMoreOlder: boolean) => {
          if (get().messages.length > 0) return;
          set({ messages, hasMoreOlder, loadingOlder: false });
        },
        prependOlder: (messages: Message[], hasMoreOlder: boolean) =>
          set({
            messages: [...messages, ...get().messages],
            hasMoreOlder,
            loadingOlder: false,
          }),
        setLoadingOlder: (loading: boolean) => set({ loadingOlder: loading }),
      }),
      {
        name: CHAT_PREFS_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          model: state.model,
          enableWebSearch: state.enableWebSearch,
        }),
      },
    ),
  );

const ChatContext = createContext<StoreApi<ChatValue> | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // A fresh store per Provider instance. When an ancestor keys the Provider
  // by a session identity, remounting yields a new store — that's how the
  // messages/streaming state reset on new-conversation navigation. `model` is
  // persisted separately via zustand `persist`, so it survives remount.
  const [store] = useState(() => createChatStore(readInitialState()));
  return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatValue {
  const store = useContext(ChatContext);
  if (!store) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return useStore(store);
}
