"use client";

import { ModelSelect } from "@/components/blocks/models";
import {
  Conversation,
  ConversationProvider,
  Sender,
  useConversationContext,
  WebSearchTool,
} from "@mui-verse/ui/components/chat";

interface MetaEvent {
  type: "meta";
  message_id: string;
  next_assistant_id: string;
}

interface ChunkEvent {
  type: "chunk";
  content: string;
}

interface DoneEvent {
  type: "done";
}

type ChatEvent = MetaEvent | ChunkEvent | DoneEvent;

function SenderArea() {
  const { addUserMessage, onStream, stopStreaming } = useConversationContext();

  const sendMessage = async (text: string) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });

    if (!response.body) {
      stopStreaming(false);
      return;
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let buffer = "";
    let assistantContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += value;
        let sepIdx = buffer.indexOf("\n\n");
        while (sepIdx !== -1) {
          const raw = buffer.slice(0, sepIdx);
          buffer = buffer.slice(sepIdx + 2);
          sepIdx = buffer.indexOf("\n\n");

          if (!raw.startsWith("data: ")) continue;
          const payload = JSON.parse(raw.slice(6)) as ChatEvent;

          if (payload.type === "meta") {
            addUserMessage(
              { id: payload.message_id, role: "user", content: text },
              payload.next_assistant_id,
            );
          } else if (payload.type === "chunk") {
            assistantContent += payload.content;
            onStream(assistantContent);
          }
        }
      }
    } finally {
      stopStreaming(false);
    }
  };

  return (
    <Sender
      onSend={sendMessage}
      className="chat-sender"
      inputClassName="chat-sender-input"
    >
      <ModelSelect />
      <WebSearchTool />
    </Sender>
  );
}

export default function ChatPage() {
  return (
    <div className="flex h-screen w-full flex-col">
      <ConversationProvider>
        <div className="mx-auto flex w-3xl flex-1 flex-col">
          <div className="flex-1">
            <Conversation bubbleClassName="data-[role=user]:max-w-bubble-user rounded-[22px] leading-6" />
          </div>
          <SenderArea />
        </div>
      </ConversationProvider>
      <div className="my-2 flex items-center justify-center text-xs">
        AI can make mistakes. Please double-check responses.
      </div>
    </div>
  );
}
