"use client";

import { useHistory } from "@/components/blocks/history/HistoryProvider";
import {
  deleteConversation,
  pinConversation,
  updateConversationTitle,
} from "@/lib/apis/conversation";
import { Conversation } from "@/lib/types/chat";
import { genConversationID } from "@/lib/uuid";
import { useChat } from "@mui-verse/ui/components/chat";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useConversation } from "./useConversation";

// Sync conversation after operations.
export function useConversationMutations() {
  const { conversation: opened, setConversation, reset } = useConversation();
  const { setChat } = useChat();
  const history = useHistory();
  const router = useRouter();
  const search = useSearchParams();

  const isCurrent = (c: Conversation) =>
    c.conversation_id === opened?.conversation_id;

  const isNew = search.get("n") === "1";

  const rename = async (c: Conversation, title: string): Promise<boolean> => {
    const success = await updateConversationTitle(c.conversation_id, title);
    if (!success) {
      toast.error("network exception");
      return false;
    }

    if (isCurrent(c)) {
      setConversation({ title });
    }

    if (c.pinned) {
      history.refreshPinned();
    } else {
      history.refreshRecents();
    }

    return true;
  };

  const togglePin = async (c: Conversation): Promise<boolean> => {
    const pinned = !c.pinned;
    const success = await pinConversation(c.conversation_id, pinned);
    if (!success) {
      toast.error("network exception");
      return false;
    }

    if (isCurrent(c)) {
      setConversation({ pinned });
    }

    history.refreshConversations();
    history.scrollPinnedIntoView();
    return true;
  };

  const remove = async (c: Conversation) => {
    const success = await deleteConversation(c.conversation_id);
    if (!success) {
      toast.error("network exception");
      return;
    }

    if (isCurrent(c)) {
      useConversation.getState().reset();
      router.push("/chat");
    }

    if (c.pinned) {
      history.refreshPinned();
    } else {
      history.refreshRecents();
    }
  };

  const switchConversation = (ctx: {
    model?: string;
    conversationID?: string;
  }) => {
    if (ctx.model) {
      setChat({ model: ctx.model });

      // conversation has not changed, do not refresh, as re-render chat page
      // is expensive, many data will be retrieved from server side.
      if (isNew && !ctx.conversationID) {
        return;
      }
    }

    reset();

    if (ctx.conversationID) {
      router.push(`/chat/${ctx.conversationID}`);
    } else {
      // new conversation.
      const id = genConversationID();
      router.push(`/chat/${id}?n=1`);
    }
  };

  return { rename, togglePin, remove, switchConversation };
}
