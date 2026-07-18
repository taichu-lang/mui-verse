"use client";

import { AuthZone } from "@/auth/AuthZone";
import { ModelBrandCard, ModelSelect } from "@/components/blocks/models";
import { useConversation } from "@/hooks/useConversation";
import { useRouter } from "@/i18n/navigation";
import type { Conversation as ConversationMeta } from "@/lib/types/chat";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  Conversation,
  Message,
  Sender,
  useChat,
  WebSearchTool,
} from "@mui-verse/ui/components/chat";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { MessagesPage } from "./lib";
import { useLoadOlder } from "./useLoadOlder";
import { useHistory } from "@/components/blocks/history/HistoryProvider";
import { PlanUsage } from "@/components/blocks/usage/PlanUsage";

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
  // Read the conversation id off the URL each render — after the first-message
  // router.replace, the next send closes over the new id automatically.
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
  const { setConversation, onInit } = useConversation();
  const history = useHistory();

  const sendMessage = async (text: string) => {
    await fetchEventSource("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        content: text,
        tools: enableWebSearch ? ["web_search"] : [],
        ...(conversationId ? { conversation_id: conversationId } : {}),
      }),
      onmessage(ev) {
        switch (ev.event) {
          case "meta": {
            const payload = JSON.parse(ev.data) as MetaData;
            // First message of a brand-new conversation: promote /chat to
            // /chat/<id> without remounting the ChatProvider (see the
            // /chat -> /chat/<id> exemption in useSessionKey).
            if (!conversationId) {
              router.replace(`/chat/${payload.conversation_id}`);
              onInit(payload.conversation_id);
            }
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
            const payload = JSON.parse(ev.data) as Message;
            replaceMessage(payload);
            stopStreaming(true);
            break;
          }

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
  initialMessages?: MessagesPage;
  initialConversation?: ConversationMeta;
}) {
  const senderWrapperRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { messages, hydrate } = useChat();
  const params = useParams<{ slug?: string }>();
  const conversationId = params.slug;
  const loadOlder = useLoadOlder(conversationId);

  // Hydrate once from the RSC-fetched initial page. The store's own guard
  // (skip if messages non-empty) protects the /chat -> /chat/<id> exemption
  // where the Provider stays mounted with in-flight streaming state — a fresh
  // RSC fetch during that transition MUST NOT clobber the just-streamed pair.
  useEffect(() => {
    if (!initialMessages) return;
    hydrate(initialMessages.messages, initialMessages.has_more);
  }, [initialMessages, hydrate]);

  // Seed the Navbar's conversation store from the RSC-fetched metadata so a
  // hard refresh on /chat/<id> restores the title/pinned state that the
  // sidebar's click-handler would otherwise be the only writer for.
  useEffect(() => {
    if (!initialConversation) return;
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
