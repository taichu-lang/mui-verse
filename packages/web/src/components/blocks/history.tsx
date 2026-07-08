"use client";

import { ChatIcon, DeleteIcon, PencilIcon } from "@/components/icons";
import { PinnerIcon, UnpinIcon } from "@/components/icons/Pinner";
import { Accordion } from "@/components/ui/Accordion";
import { Conversation } from "@/lib/types/chat";
import { Pagination } from "@/lib/types/pagination";
import { InlineEditInput } from "@mui-verse/ui/components/inputs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  MenuItem,
} from "@mui-verse/ui/components/navigation";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { cn } from "@mui-verse/ui/utils/cn";
import { EllipsisIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

interface ConversationValue {
  editMode: boolean;
  conversation: Conversation;
  setConversation: (conversation: Partial<Conversation>) => void;
  toggleEditMode: () => void;
}

const ConversationContext = createContext<ConversationValue | null>(null);

function useConversation() {
  const ctx = useContext(ConversationContext);
  if (!ctx) {
    throw new Error(
      "useConversation must be used within a ConversationProvider",
    );
  }

  return ctx;
}

function ConversationProvider({
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
    <ConversationContext.Provider
      value={{ conversation, editMode, toggleEditMode, setConversation }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

function ConversationTitleEditor() {
  const { conversation, toggleEditMode, setConversation } = useConversation();

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
  const { conversation, toggleEditMode } = useConversation();

  const handlePin = async () => {
    try {
      await fetch(`/api/conversations/${conversation.id}`, {
        method: "POST",
        body: JSON.stringify({
          pinned: !conversation.pinned,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/conversations/${conversation.id}`, {
        method: "DELETE",
      });
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

function ChatAction() {
  return (
    <DropdownMenu side="right" align="start">
      <DropdownMenuTrigger>
        <EllipsisIcon className="hidden h-4 w-4 group-hover:block" />
      </DropdownMenuTrigger>
      <ChatActionItems />
    </DropdownMenu>
  );
}

function ChatMenu({ includingIcon = false }: { includingIcon?: boolean }) {
  const { conversation, editMode } = useConversation();

  return (
    <MenuItem actions={<ChatAction />}>
      {includingIcon && (
        <div className="shrink-0">
          <ChatIcon />
        </div>
      )}
      {editMode ? (
        <ConversationTitleEditor />
      ) : (
        <span className="truncate text-sm">{conversation.title}</span>
      )}
    </MenuItem>
  );
}

export function ChatHistory({
  pinned = false,
  className,
}: {
  pinned?: boolean;
  className?: string;
}) {
  const { collapsed } = useSidebar();
  const title = pinned ? "Pinned" : "Recents";
  const [history, setHistory] = useState<Conversation[]>([]);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const response = await fetch(`/api/conversations?pinned=${pinned}`);
      const conversations = (await response.json()) as Pagination<Conversation>;
      setHistory(conversations.items);
    });
  }, [pinned]);

  if (collapsed) {
    return (
      <DropdownMenu side="right" align="start">
        <DropdownMenuTrigger>
          <MenuButton
            title="history"
            icon={pinned ? <PinnerIcon /> : <ChatIcon />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sx={{
            maxWidth: "282px",
            width: "100%",
          }}
          shadow="none"
        >
          <p className="mt-1.5 mb-2 ml-2 text-sm font-semibold">{title}</p>
          <div className="flex flex-col gap-0.5">
            {history.map((conversation) => (
              <ConversationProvider
                conversation={conversation}
                key={conversation.id}
              >
                <ChatMenu includingIcon />
              </ConversationProvider>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Accordion title={title} className={cn("gap-0.5", className)}>
      {history.map((conversation) => (
        <ConversationProvider conversation={conversation} key={conversation.id}>
          <ChatMenu />
        </ConversationProvider>
      ))}
    </Accordion>
  );
}
