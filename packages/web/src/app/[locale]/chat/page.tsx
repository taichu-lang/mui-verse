"use client";

import { AuthZone } from "@/auth/AuthZone";
import { ModelSelect } from "@/components/blocks/models";
import { useConversation } from "@/hooks/useConversation";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  Conversation,
  Sender,
  useChat,
  WebSearchTool,
} from "@mui-verse/ui/components/chat";
import { useEffect, useRef } from "react";

// event: meta
interface MetaData {
  message_id: string;
  next_assistant_id: string;
  conversation_id: string;
}

// event: chunk
interface ChunkData {
  message_id: string;
  chunk: string;
}

// event: title
interface TitleData {
  conversation_id: string;
  title: string;
}

function SenderArea() {
  const { addUserMessage, onStream, stopStreaming } = useChat();
  const { setConversation, onInit } = useConversation();
  const conversationIdRef = useRef<string | null>(null);

  const sendMessage = async (text: string) => {
    await fetchEventSource("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1",
        content: text,
        ...(conversationIdRef.current
          ? { conversation_id: conversationIdRef.current }
          : {}),
      }),
      onmessage(ev) {
        switch (ev.event) {
          case "meta": {
            const payload = JSON.parse(ev.data) as MetaData;
            conversationIdRef.current = payload.conversation_id;
            onInit(payload.conversation_id);
            addUserMessage(
              { message_id: payload.message_id, role: "user", content: text },
              payload.next_assistant_id,
            );
            break;
          }

          case "chunk": {
            const payload = JSON.parse(ev.data) as ChunkData;
            onStream(payload.message_id, payload.chunk);
            break;
          }

          case "title": {
            const payload = JSON.parse(ev.data) as TitleData;
            setConversation({ title: payload.title });
            break;
          }

          case "done":
            stopStreaming(true);
            break;

          default:
            break;
        }
      },
      onclose() {
        stopStreaming(false);
      },
      onerror(err) {
        console.log(err);
        stopStreaming(false);
      },
    });
  };

  return (
    <AuthZone>
      <Sender
        minRows={2}
        maxRows={12}
        onSend={sendMessage}
        className="chat-sender"
        inputClassName="chat-sender-input"
      >
        <ModelSelect />
        <WebSearchTool />
      </Sender>
    </AuthZone>
  );
}

export default function ChatPage() {
  const senderWrapperRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Publish the floating sender's height as --chat-sender-offset on the page
  // root — a shared ancestor of both the sender wrapper and the Conversation's
  // end sentinel — so scroll-margin-bottom on the sentinel parks auto-scroll
  // above the sender rather than underneath it. CSS variables inherit down,
  // so setting it on a sibling of the sentinel (as before) silently no-ops.
  useEffect(() => {
    const sender = senderWrapperRef.current;
    const root = rootRef.current;
    if (!sender || !root) return;

    const update = () => {
      root.style.setProperty(
        "--chat-sender-offset",
        `${sender.offsetHeight}px`,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(sender);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="max-w-chat-area mx-auto flex w-full flex-1 flex-col"
    >
      <div className="mt-2 flex-1">
        <Conversation bubbleClassName="data-[role=user]:max-w-bubble-user rounded-[22px] leading-6" />
      </div>

      <div
        ref={senderWrapperRef}
        className="z-navbar sticky bottom-0 bg-white/80 backdrop-blur"
      >
        <SenderArea />
        <div className="my-2 flex items-center justify-center text-xs">
          AI can make mistakes. Please double-check responses.
        </div>
      </div>
    </div>
  );
}
