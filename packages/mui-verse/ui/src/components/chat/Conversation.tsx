"use client";

import { StreamingIcon } from "@mui-verse/ui/components/icons";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Bubble } from "./Bubble";
import { Message } from "./types";

interface ConversationValue {
  streaming: boolean;
  messages: Message[];
  stopStreaming: (interrupted?: boolean) => void;
  addUserMessage: (message: Message, assistantMessageID: string) => void;
  onStream: (content: string) => void;
}

const ConversationContext = createContext<ConversationValue | null>(null);

export function useConversationContext() {
  const ctx = useContext(ConversationContext);
  if (!ctx) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider",
    );
  }

  return ctx;
}

export function ConversationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [streaming, setStreaming] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const stopStreaming = useCallback((interrupted?: boolean) => {
    setStreaming(false);
  }, []);

  const addUserMessage = useCallback(
    (message: Message, assistantMessageID: string) => {
      setMessages((prev) => [
        ...prev,
        message,
        { id: assistantMessageID, role: "assistant", content: "" },
      ]);
      setStreaming(true);
    },
    [],
  );

  const handleStream = useCallback((content: string) => {
    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (!lastMessage || lastMessage.role !== "assistant") {
        console.warn("Not assistant message.");
        return prev;
      }

      return [...prev.slice(0, -1), { ...lastMessage, content }];
    });
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        streaming,
        messages,
        stopStreaming,
        addUserMessage,
        onStream: handleStream,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

// TODO(Leo): Refer to https://ui.shadcn.com/docs/components/base/message-scroller.
export function Conversation({
  bubbleClassName,
}: {
  bubbleClassName?: string;
}) {
  const { streaming, messages } = useConversationContext();
  // Sentinel just after the last message. scrollIntoView scrolls the nearest
  // scrollable ancestor (usually the window) into view. The sentinel carries a
  // scroll-margin-bottom so it lands above a floating sender rather than
  // underneath it; consumers set --chat-sender-offset on any ancestor to the
  // sender's height (defaults to 0 when not set).
  const endRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Instant, not smooth: streaming chunks fire this many times per second, and
  // queued smooth animations visibly lag behind the freshly-rendered content.
  const stickToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, []);

  useEffect(() => {
    stickToEnd();
  }, [messages, stickToEnd]);

  // Streamdown may re-flow after the React commit (code blocks, math, images),
  // which grows the list's height without a new messages update. Follow those
  // growths too so the tail never gets hidden behind the sender.
  useEffect(() => {
    if (!streaming || !listRef.current) return;
    const observer = new ResizeObserver(stickToEnd);
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [streaming, stickToEnd]);

  return (
    <div className="flex h-full flex-col gap-1" ref={listRef}>
      {messages.map((message, idx) => (
        <Bubble
          key={message.id}
          message={message}
          className={bubbleClassName}
          streaming={idx === messages.length - 1 ? streaming : undefined}
        />
      ))}
      {streaming && <StreamingIcon />}
      <div
        ref={endRef}
        aria-hidden
        className="h-0 scroll-mb-(--chat-sender-offset,0px)"
      />
    </div>
  );
}
