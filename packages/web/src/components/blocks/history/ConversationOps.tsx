"use client";

import {
  DeleteIcon,
  PencilIcon,
  PinnerIcon,
  UnpinIcon,
} from "@/components/icons";
import { useConversationMutations } from "@/hooks/useConversationMutations";
import { Conversation } from "@/lib/types/chat";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
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

interface ConversationOpsValue {
  editMode: boolean;
  target: Conversation;
  setTarget: (target: Partial<Conversation>) => void;
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
  target: defaultValue,
  children,
}: {
  target: Conversation;
  children: React.ReactNode;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [target, setTargetState] = useState<Conversation>(defaultValue);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  const setTarget = useCallback((c: Partial<Conversation>) => {
    setTargetState((prev) => ({
      ...prev,
      ...c,
    }));
  }, []);

  return (
    <ConversationOpsContext.Provider
      value={{ target, editMode, toggleEditMode, setTarget }}
    >
      {children}
    </ConversationOpsContext.Provider>
  );
}

export function ConversationTitleEditor() {
  const { target, toggleEditMode } = useConversationOps();
  const { rename } = useConversationMutations();

  const handleSubmit = async (value: string) => {
    await rename(target, value);
    toggleEditMode();
  };

  return (
    <InlineEditInput
      defaultValue={target.title}
      onSubmit={(v) => handleSubmit(v as string)}
    />
  );
}

export function ChatActionItems() {
  const { target, toggleEditMode } = useConversationOps();
  const { togglePin, remove } = useConversationMutations();

  const handlePin = async () => {
    await togglePin(target);
  };

  const handleDelete = async () => {
    await remove(target);
  };

  return (
    <DropdownMenuContent shadow="none" sx={{ py: "14px", minWidth: "194px" }}>
      <DropdownMenuItem onClick={toggleEditMode}>
        <PencilIcon />
        Rename
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handlePin}>
        {target.pinned ? <UnpinIcon /> : <PinnerIcon />}
        {target.pinned ? "Unpin chat" : "Pin Chat"}
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
        <IconGhostButton className="hidden h-8 w-8 cursor-context-menu group-hover:flex">
          <EllipsisIcon className="h-4 w-4" />
        </IconGhostButton>
      </DropdownMenuTrigger>
      <ChatActionItems />
    </DropdownMenu>
  );
}
