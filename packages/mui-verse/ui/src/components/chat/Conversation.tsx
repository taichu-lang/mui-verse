"use client";

import { StreamingIcon } from "@mui-verse/ui/components/icons";
import { createContext, useCallback, useContext, useState } from "react";
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

export function Conversation({
  bubbleClassName,
}: {
  bubbleClassName?: string;
}) {
  const { streaming, messages } = useConversationContext();

  return (
    <div className="flex h-full flex-col gap-1">
      {messages.map((message) => (
        <Bubble
          key={message.id}
          message={message}
          className={bubbleClassName}
        />
      ))}
      {streaming && <StreamingIcon />}
    </div>
  );
}
