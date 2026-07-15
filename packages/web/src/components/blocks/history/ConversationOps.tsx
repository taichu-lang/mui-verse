"use client";

import {
  DeleteIcon,
  PencilIcon,
  PinnerIcon,
  UnpinIcon,
} from "@/components/icons";
import { Conversation } from "@/lib/types/chat";
import { InlineEditInput } from "@mui-verse/ui/components/inputs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";
import { EllipsisIcon } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
import { useHistory } from "./HistoryProvider";

interface ConversationOpsValue {
  editMode: boolean;
  conversation: Conversation;
  setConversation: (conversation: Partial<Conversation>) => void;
  toggleEditMode: () => void;
}

const ConversationOpsContext = createContext<ConversationOpsValue | null>(null);

export function useConversationOps() {
  const ctx = useContext(ConversationOpsContext);
  if (!ctx) {
    throw new Error(
      "useConversationOps must be used within a ConversationOpsProvider",
    );
  }

  return ctx;
}

export function ConversationOpsProvider({
  conversation: defaultValue,
  children,
}: {
  conversation: Conversation;
  children: React.ReactNode;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [conversation, setConversationState] =
    useState<Conversation>(defaultValue);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  const setConversation = useCallback((c: Partial<Conversation>) => {
    setConversationState((prev) => ({
      ...prev,
      ...c,
    }));
  }, []);

  return (
    <ConversationOpsContext.Provider
      value={{ conversation, editMode, toggleEditMode, setConversation }}
    >
      {children}
    </ConversationOpsContext.Provider>
  );
}

export function ConversationTitleEditor() {
  const { conversation, toggleEditMode, setConversation } =
    useConversationOps();

  const handleSubmit = async (value: string) => {
    try {
      await fetch(`/api/conversations/${conversation.id}`, {
        method: "POST",
        body: JSON.stringify({
          title: value,
        }),
      });
      toggleEditMode();
      setConversation({
        title: value,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <InlineEditInput
      defaultValue={conversation.title}
      onSubmit={(v) => handleSubmit(v as string)}
    />
  );
}

export function ChatActionItems() {
  const { conversation, toggleEditMode } = useConversationOps();
  const controller = useHistory();

  const handlePin = async () => {
    try {
      await fetch(`/api/conversations/${conversation.id}`, {
        method: "POST",
        body: JSON.stringify({
          pinned: !conversation.pinned,
        }),
      });
      // Refresh both lists back to page 1 and scroll to the top of Pinned so
      // the user sees the result of their action land in place.
      await controller.refreshConversations();
      controller.scrollPinnedIntoView();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/conversations/${conversation.id}`, {
        method: "DELETE",
      });
      if (conversation.pinned) {
        await controller.refreshPinned();
      } else {
        await controller.refreshRecents();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DropdownMenuContent shadow="none" sx={{ py: "14px", minWidth: "194px" }}>
      <DropdownMenuItem onClick={toggleEditMode}>
        <PencilIcon />
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handlePin}>
        {conversation.pinned ? <UnpinIcon /> : <PinnerIcon />}
        {conversation.pinned ? "Unpin chat" : "Pin Chat"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-error-500 hover:bg-error-200"
        onClick={handleDelete}
      >
        <DeleteIcon />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

export function ChatAction() {
  return (
    <DropdownMenu side="right" align="start">
      <DropdownMenuTrigger>
        <EllipsisIcon className="hidden h-4 w-4 group-hover:block" />
      </DropdownMenuTrigger>
      <ChatActionItems />
    </DropdownMenu>
  );
}
