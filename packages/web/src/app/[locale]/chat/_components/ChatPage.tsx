"use client";

import { AuthZone } from "@/auth/AuthZone";
import { useHistory } from "@/components/blocks/history/HistoryProvider";
import { ModelBrandCard, ModelSelect } from "@/components/blocks/models";
import { PlanUsage } from "@/components/blocks/usage/PlanUsage";
import { useConversation } from "@/hooks/useConversation";
import { useRouter } from "@/i18n/navigation";
import type {
  ChatRequest,
  Conversation as ConversationMeta,
} from "@/lib/types/chat";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  Conversation,
  Message,
  Sender,
  useChat,
  WebSearchTool,
} from "@mui-verse/ui/components/chat";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { MessagesPage } from "./lib";
import { useLoadOlder } from "./useLoadOlder";

// event: meta
interface MetaData {
  message_id: string;
  next_assistant_id: string;
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
  // The id is set in the URL before the first send (generated in /chat/page.tsx
  // and pushed as /chat/<id>?n=1), so this is the single source of truth.
  const params = useParams<{ slug?: string }>();
  const conversationId = params.slug;

  const router = useRouter();
  const {
    addUserMessage,
    onStream,
    replaceMessage,
    stopStreaming,
    model,
    enableWebSearch,
    setSharedState,
  } = useChat();
  const { setConversation } = useConversation();
  const history = useHistory();

  const sendMessage = async (text: string, controller: AbortController) => {
    if (!conversationId) {
      return;
    }

    const message: ChatRequest = {
      conversation_id: conversationId,
      model,
      content: text,
    };
    if (enableWebSearch) {
      message.tools = ["web_search"];
    }

    await fetchEventSource("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
      signal: controller.signal,
      onmessage(ev) {
        switch (ev.event) {
          case "meta": {
            const payload = JSON.parse(ev.data) as MetaData;
            router.replace(`/chat/${conversationId}`);
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

            // Once the title has been generated, we can reload the recent
            // conversation history.
            history.refreshRecents();
            break;
          }

          case "done": {
            // We get the final message includes annotations, we need to
            // replace the message to enable rendering properly.
            const payload = JSON.parse(ev.data) as Message;
            replaceMessage(payload);
            stopStreaming();
            break;
          }

          default:
            break;
        }
      },
      onclose() {
        // Server side closes the connection unexpectedly.
        stopStreaming();
      },
      onerror() {
        stopStreaming();
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
        <WebSearchTool
          defaultChecked={enableWebSearch}
          onSwitch={(checked: boolean) =>
            setSharedState({ enableWebSearch: checked })
          }
        />
        <PlanUsage />
      </Sender>
    </AuthZone>
  );
}

export function ChatPage({
  initialMessages,
  initialConversation,
}: {
  initialMessages: MessagesPage;
  initialConversation: ConversationMeta;
}) {
  const senderWrapperRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { messages, hydrate } = useChat();
  const params = useParams<{ slug?: string }>();
  const conversationId = params.slug;
  const newly = useSearchParams().get("n") === "1";
  const loadOlder = useLoadOlder(conversationId, newly);

  // Hydrate once from the RSC-fetched initial page. For a brand-new
  // conversation (?n=1) initialMessages is empty and there is nothing to
  // hydrate — streaming will populate the store directly.
  useEffect(() => {
    if (initialMessages.messages.length === 0) return;
    hydrate(initialMessages.messages, initialMessages.has_more);
  }, [initialMessages, hydrate]);

  // Seed the Navbar's conversation store from the RSC-fetched metadata so a
  // hard refresh on /chat/<id> restores the title/pinned state that the
  // sidebar's click-handler would otherwise be the only writer for.
  useEffect(() => {
    const current = useConversation.getState().conversation;
    if (current?.conversation_id === initialConversation.conversation_id) {
      return;
    }
    useConversation.getState().setConversation(initialConversation);
  }, [initialConversation]);

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
      {messages.length === 0 ? (
        <ModelBrandCard />
      ) : (
        <div className="mt-2 flex-1">
          <Conversation
            bubbleClassName="data-[role=user]:max-w-bubble-user rounded-[22px] leading-6"
            onReachTop={loadOlder}
          />
        </div>
      )}

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

// DefaultChatPage is the skeleton of the chat page even though user hasn't signed in.
export function DefaultChatPage() {
  return (
    <div className="max-w-chat-area mx-auto flex w-full flex-1 flex-col">
      <ModelBrandCard />
      <div className="z-navbar sticky bottom-0 bg-white/80 backdrop-blur">
        <SenderArea />
        <div className="my-2 flex items-center justify-center text-xs">
          AI can make mistakes. Please double-check responses.
        </div>
      </div>
    </div>
  );
}
