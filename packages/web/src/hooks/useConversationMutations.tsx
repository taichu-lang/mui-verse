import { useHistory } from "@/components/blocks/history/HistoryProvider";
import {
  deleteConversation,
  pinConversation,
  updateConversationTitle,
} from "@/lib/apis/conversation";
import { Conversation } from "@/lib/types/chat";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useConversation } from "./useConversation";

// Sync conversation after operations.
export function useConversationMutations() {
  const { conversation: opened, setConversation } = useConversation();
  const history = useHistory();
  const router = useRouter();

  const isCurrent = (c: Conversation) =>
    c.conversation_id === opened?.conversation_id;

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

  return { rename, togglePin, remove };
}
