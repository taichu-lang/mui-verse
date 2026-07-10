"use client";

import { StreamingIcon } from "@mui-verse/ui/components/icons";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Bubble } from "./Bubble";
import { useChatScrollContainer } from "./ChatScrollContext";
import { Message } from "./types";

interface ChatValue {
  model: string;
  streaming: boolean;
  messages: Message[];
  setModel: (model: string) => void;
  stopStreaming: (interrupted?: boolean) => void;
  addUserMessage: (message: Message, assistantMessageID: string) => void;
  onStream: (message_id: string, chunk: string) => void;
}

// Preferences shared across sessions. Kept out of the session store so a
// per-Provider remount (new-conversation navigation) doesn't drop the choice.
const CHAT_PREFS_KEY = "chat.prefs";
const readInitialModel = (): string => {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(CHAT_PREFS_KEY);
    return raw ? (JSON.parse(raw).model ?? "") : "";
  } catch {
    return "";
  }
};

const createChatStore = (initialModel: string) =>
  createStore<ChatValue>()(
    persist(
      (set, get) => ({
        model: initialModel,
        streaming: false,
        messages: [],

        setModel: (model: string) => set({ model }),
        stopStreaming: () => set({ streaming: false }),
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
      }),
      {
        name: CHAT_PREFS_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ model: state.model }),
      },
    ),
  );

const ChatContext = createContext<StoreApi<ChatValue> | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // A fresh store per Provider instance. When an ancestor keys the Provider
  // by a session identity, remounting yields a new store — that's how the
  // messages/streaming state reset on new-conversation navigation. `model` is
  // persisted separately via zustand `persist`, so it survives remount.
  const [store] = useState(() => createChatStore(readInitialModel()));
  return <ChatContext.Provider value={store}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatValue {
  const store = useContext(ChatContext);
  if (!store) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return useStore(store);
}

export function Conversation({
  bubbleClassName,
}: {
  bubbleClassName?: string;
}) {
  const { streaming, messages } = useChat();

  // Sentinel just after the last message. scrollIntoView scrolls the nearest
  // scrollable ancestor into view. The sentinel carries a scroll-margin-bottom
  // so it lands above a floating sender rather than underneath it; consumers
  // set --chat-sender-offset on any ancestor to the sender's height (defaults
  // to 0 when not set).
  const endRef = useRef<HTMLDivElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollElement = useChatScrollContainer();

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 120,
    overscan: 5,
    getItemKey: (index) => messages[index].message_id,
    // Append semantics: when a new message is pushed AND user is already at the
    // bottom, scrollToEnd automatically. Requires anchorTo: "end". Does NOT
    // fire for streaming chunks (last item resizing without a count change) —
    // the ResizeObserver below handles that.
    anchorTo: "end",
    followOnAppend: true,
  });

  const stickToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Streamdown may re-flow after the React commit (code blocks, math, images),
  // which grows the list's height without a new messages update. The outer
  // container's height tracks virtualizer.getTotalSize(), so measurement
  // updates from the streaming bubble bubble up as height changes here.
  useEffect(() => {
    if (!streaming || !messageAreaRef.current) return;
    const observer = new ResizeObserver(stickToEnd);
    observer.observe(messageAreaRef.current);
    return () => observer.disconnect();
  }, [streaming, stickToEnd]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="flex h-full flex-col" ref={messageAreaRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {virtualItems.map((vi) => {
          const message = messages[vi.index];
          const isLast = vi.index === messages.length - 1;
          return (
            <div
              key={vi.key}
              data-index={vi.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vi.start}px)`,
              }}
            >
              <Bubble
                message={message}
                className={bubbleClassName}
                streaming={isLast ? streaming : undefined}
              />
            </div>
          );
        })}
      </div>
      {streaming && <StreamingIcon />}
      <div
        ref={endRef}
        aria-hidden
        className="h-0 scroll-mb-(--chat-sender-offset,0px)"
      />
    </div>
  );
}
