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
  // Pagination — only the historically-loaded prefix has ids; the tail (an
  // in-flight user/assistant pair) is id-less. `messages[0]` is always the
  // cursor source, and it is only ever a hydrated or prepended history row.
  hasMoreOlder: boolean;
  loadingOlder: boolean;
  setModel: (model: string) => void;
  stopStreaming: (interrupted?: boolean) => void;
  addUserMessage: (message: Message, assistantMessageID: string) => void;
  onStream: (message_id: string, chunk: string) => void;
  hydrate: (messages: Message[], hasMoreOlder: boolean) => void;
  prependOlder: (messages: Message[], hasMoreOlder: boolean) => void;
  setLoadingOlder: (loading: boolean) => void;
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
        hasMoreOlder: false,
        loadingOlder: false,

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
  onReachTop,
}: {
  bubbleClassName?: string;
  // Fired when the top sentinel enters the viewport (with a 200px lead), and
  // only while more history exists AND no load is already in flight. Consumers
  // orchestrate the actual fetch + `prependOlder` externally so scroll-anchor
  // preservation can bracket the state update (see useLoadOlder).
  onReachTop?: () => void;
}) {
  const { streaming, messages, hasMoreOlder, loadingOlder } = useChat();

  // Sentinel just after the last message. scrollIntoView scrolls the nearest
  // scrollable ancestor into view. The sentinel carries a scroll-margin-bottom
  // so it lands above a floating sender rather than underneath it; consumers
  // set --chat-sender-offset on any ancestor to the sender's height (defaults
  // to 0 when not set).
  const endRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollElement = useChatScrollContainer();

  const [initialSettled, setInitialSettled] = useState(false);

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
    endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, []);

  // Re-stick to the end whenever the message area's height changes, but only
  // while auto-stick is warranted: during streaming (assistant bubble grows
  // as chunks arrive; Streamdown may re-flow post-commit for code blocks,
  // math, images), OR during the initial-load window right after hydrate,
  // before the virtualizer has finished measuring bubbles.
  //
  // The initial-load case matters because a one-shot scrollIntoView on
  // hydrate lands on stale geometry: virtualizer starts with
  // estimateSize (120px per row), so getTotalSize() is much smaller than
  // reality; endRef sits at that estimated bottom. As measureElement fires
  // on each rendered bubble, the total grows — but scrollTop doesn't chase
  // it. Observing the message area lets every measurement pass re-park us
  // at the true bottom until things settle.
  useEffect(() => {
    const active = streaming || !initialSettled;
    if (!active || !messageAreaRef.current || messages.length === 0) return;
    const observer = new ResizeObserver(stickToEnd);
    observer.observe(messageAreaRef.current);
    return () => observer.disconnect();
  }, [streaming, initialSettled, messages.length, stickToEnd]);

  // Release the initial-load auto-stick after two animation frames. One rAF
  // gives the virtualizer a paint to run measureElement on the currently
  // rendered bubbles; the second rAF ensures any resize-triggered re-render
  // has also flushed. After this, further scroll changes are user-driven
  // (except during streaming, which reactivates the observer above) — we
  // must stop auto-sticking so the user can scroll up without being fought.
  useEffect(() => {
    if (initialSettled || messages.length === 0) return;
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setInitialSettled(true));
    });
    return () => cancelAnimationFrame(t);
  }, [initialSettled, messages.length]);

  // Top sentinel — a zero-height marker at offset 0 inside the virtual list.
  // IntersectionObserver fires with a 200px lead so the next page starts
  // fetching before the user actually reaches the top. The observer is
  // recreated when hasMoreOlder flips false so we stop firing at the end of
  // history; the loadingOlder guard is checked at fire time (fresh state read)
  // to avoid closure-stale reads across rapid scroll events.
  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel || !scrollElement || !hasMoreOlder || !onReachTop) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onReachTop();
      },
      { root: scrollElement, rootMargin: "200px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [scrollElement, hasMoreOlder, onReachTop]);

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
        <div
          ref={topSentinelRef}
          aria-hidden
          style={{ position: "absolute", top: 0, left: 0, height: 1, width: 1 }}
        />
        {loadingOlder && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              padding: 8,
            }}
          >
            <StreamingIcon />
          </div>
        )}
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
