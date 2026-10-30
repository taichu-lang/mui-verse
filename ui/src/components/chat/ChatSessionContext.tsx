"use client";

import { createContext, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { Message } from "./types";

type RenderAssistantErrorFunc = () => React.ReactNode;

type StopReason = "interrupted" | "error" | "done";

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

  // The current streaming message, if any. Once the message is done, it will
  // be moved to `messages`.
  streamingMessage: Message | null;

  // Messages of completed turns.
  messages: Message[];

  // Internal field, not state.
  renderAssistantError: RenderAssistantErrorFunc | null;

  // The streaming might be stopped in three cases:
  //
  // - User interrupted. In this case, `message` is null.
  // - This turn is completed, `message` is the completed message of this turn.
  // - Something error, ex: the connection is closed.
  //
  stopStreaming: (reason?: StopReason, message?: Message) => void;
  addUserMessage: (message: Message, assistantMessageID: string) => void;
  onStream: (message_id: string, chunk: string) => void;

  resend: () => Message | null;

  registerRenderAssistantError: (
    handler: RenderAssistantErrorFunc | null,
  ) => void;

  // Append messages only once.
  hydrate: (messages: Message[]) => void;

  // Prepend older messages based on the cursor of messages[0]. Only writes
  // the messages array; pagination flags are the caller's concern.
  prepend: (messages: Message[]) => void;

  // Append newer messages based on the cursor of messages[messages.length - 1].
  append: (messages: Message[]) => void;

  // Replace the current messages array wholesale. Used when a mid-conversation
  // entry (search-jump) needs to be re-anchored to the latest window after a
  // new user turn, since blindly appending would leave a discontinuity.
  reset: (messages: Message[]) => void;
}

const createChatSessionStore = () =>
  createStore<ChatSessionValue>()((set, get) => ({
    pending: false,
    streaming: false,
    streamingMessage: null,
    messages: [],
    hasMoreOlder: false,
    loadingOlder: false,
    renderAssistantError: null,

    // Client uses AbortController to interrupt the streaming. Once the
    // AbortController is aborted, client drops the connection, which means
    // client does not receive any more data from the server. However, the
    // server might not close the connection to llm provider immediately. We
    // can not get the balance after abort the connection, as there is a time
    // delay between the aborting and usage calculation in the server side. The
    // balance should be updated after the next turn.
    stopStreaming: (reason?: StopReason, message?: Message) =>
      set((state) => {
        const streamingMessage = state.streamingMessage;
        if (!streamingMessage) {
          return {};
        }

        switch (reason) {
          case "interrupted":
            streamingMessage.interrupted = true;
            break;

          case "error":
            streamingMessage.hasError = true;
            break;

          default:
            break;
        }

        return {
          streaming: false,
          pending: false,
          messages: [...state.messages, message || { ...streamingMessage }],
          streamingMessage: null,
        };
      }),

    addUserMessage: (message: Message, assistantMessageID: string) =>
      set({
        messages: [...get().messages, message],
        streamingMessage: {
          message_id: assistantMessageID,
          role: "assistant",
          content: "",
        },
        pending: true,
      }),

    onStream: (message_id: string, chunk: string) =>
      set((state) => {
        const lastMessage = state.streamingMessage;
        if (
          !lastMessage ||
          lastMessage.role !== "assistant" ||
          lastMessage.message_id !== message_id
        ) {
          console.warn("Not assistant message.");
          return state;
        }

        return {
          streamingMessage: {
            ...lastMessage,
            content: lastMessage.content + chunk,
          },
          streaming: true,
        };
      }),

    resend: () => {
      if (get().pending) {
        return null;
      }

      const messages = get().messages;
      if (messages.length < 2) {
        return null;
      }

      const userMessage = messages[messages.length - 2];
      if (userMessage.role !== "user") {
        return null;
      }

      set({ messages: messages.slice(0, messages.length - 2) });
      return userMessage;
    },

    registerRenderAssistantError: (
      handler: RenderAssistantErrorFunc | null,
    ) => {
      set({ renderAssistantError: handler });
    },

    hydrate: (messages: Message[]) => {
      if (get().messages.length > 0) return;
      set({ messages });
    },

    prepend: (messages: Message[]) =>
      set((state) => ({ messages: [...messages, ...state.messages] })),

    append: (messages: Message[]) =>
      set((state) => ({ messages: [...state.messages, ...messages] })),

    reset: (messages: Message[]) => set({ messages }),
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
