"use client";

import { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { Message } from "./types";

/**
 * Connection-scoped state for one open conversation.
 *
 * Design goals
 * ------------
 * Scope: everything needed to render a single conversation's message stream —
 * the loaded messages, the pagination window, and the flags describing what's
 * in flight (`pending`, `streaming`, `loadingOlder`). None of it is meaningful
 * outside the currently-open conversation; opening a different one starts
 * from an empty slate.
 *
 * Lifetime: Provider-scoped. Each `ChatSessionProvider` instantiates its own
 * zustand store via `useState`, so remounting the Provider — typically by
 * keying it on the pathname — discards the store and every subscriber picks
 * up the new one on the next render. This gives React-managed teardown for
 * free: an SSE callback that closed over the old store's `set` becomes a
 * no-op once the store is GC'd, so a switch mid-stream cannot interleave
 * chunks into the next conversation. No manual reset, no per-field cleanup
 * discipline as we add state.
 *
 * Not for user preferences: `model`, `enableWebSearch`, and anything else
 * that must survive a conversation switch belongs in `useChat` — the
 * module-level shared store in `useChat.ts`.
 *
 * Not for business metadata: conversation identity, title, pinned state, and
 * similar are the business layer's concern (see the web app's
 * `useConversation`). Keeping them out of this Provider lets the sidebar
 * write them before navigation without the write being lost to the impending
 * remount.
 */
export interface ChatSessionValue {
  // The reason to have two state flags is that the conversation can only be
  // interrupted after the first chunk is received. So use `pending` to avoid
  // double input, and `streaming` to control interruption.

  // The state during `user input` ~ `message done` or `interrupted`.
  pending: boolean;

  // The state during `first chunk` ~ `message done` or `interrupted`.
  streaming: boolean;

  messages: Message[];
  // Pagination — only the historically-loaded prefix has ids; the tail (an
  // in-flight user/assistant pair) is id-less. `messages[0]` is always the
  // cursor source, and it is only ever a hydrated or prepended history row.
  hasMoreOlder: boolean;
  loadingOlder: boolean;

  stopStreaming: (interrupted?: boolean) => void;
  addUserMessage: (message: Message, assistantMessageID: string) => void;
  onStream: (message_id: string, chunk: string) => void;
  replaceMessage: (message: Message) => void;
  hydrate: (messages: Message[], hasMoreOlder: boolean) => void;
  prependOlder: (messages: Message[], hasMoreOlder: boolean) => void;
  setLoadingOlder: (loading: boolean) => void;
}

const createChatSessionStore = () =>
  createStore<ChatSessionValue>()((set, get) => ({
    pending: false,
    streaming: false,
    messages: [],
    hasMoreOlder: false,
    loadingOlder: false,

    // Client uses AbortController to interrupt the streaming. Once the
    // AbortController is aborted, client drops the connection, which means
    // client does not receive any more data from the server. However, the
    // server might not close the connection to llm provider immediately. We
    // can not get the balance after abort the connection, as there is a time
    // delay between the aborting and usage calculation in the server side. The
    // balance should be updated after the next turn.
    stopStreaming: (interrupted?: boolean) =>
      set((state) => {
        if (!interrupted) {
          return { streaming: false, pending: false };
        }

        const lastMessage = state.messages[state.messages.length - 1];
        if (!lastMessage) {
          return { streaming: false, pending: false };
        }

        return {
          streaming: false,
          pending: false,
          messages: [
            ...state.messages.slice(0, -1),
            { ...lastMessage, interrupted: true },
          ],
        };
      }),
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
        pending: true,
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
          streaming: true,
        };
      }),
    replaceMessage: (message: Message) =>
      set((state) => ({
        messages: state.messages.map((m) =>
          m.message_id === message.message_id ? message : m,
        ),
      })),
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
  }));

const ChatSessionContext = createContext<StoreApi<ChatSessionValue> | null>(
  null,
);

export function ChatSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // A fresh store per Provider instance. Ancestors keyed on a session identity
  // (typically the pathname) remount this Provider, yielding a new store —
  // that's how messages/streaming state resets on a conversation switch.
  const [store] = useState(() => createChatSessionStore());
  return (
    <ChatSessionContext.Provider value={store}>
      {children}
    </ChatSessionContext.Provider>
  );
}

export function useChatSession(): ChatSessionValue {
  const store = useContext(ChatSessionContext);
  if (!store) {
    throw new Error("useChatSession must be used within a ChatSessionProvider");
  }

  return useStore(store);
}
