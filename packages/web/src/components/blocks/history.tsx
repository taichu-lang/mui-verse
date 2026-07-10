"use client";

import { ChatIcon, DeleteIcon, PencilIcon } from "@/components/icons";
import { PinnerIcon, UnpinIcon } from "@/components/icons/Pinner";
import { useOptionalHistory } from "@/components/blocks/history/HistoryProvider";
import { Conversation } from "@/lib/types/chat";
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
import { EllipsisIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import type { Pagination } from "@/lib/types/pagination";
import Link from "next/link";
import { useConversation } from "@/hooks/useConversation";
import { usePathname } from "@/i18n/navigation";

interface ConversationOpsValue {
  editMode: boolean;
  conversation: Conversation;
  setConversation: (conversation: Partial<Conversation>) => void;
  toggleEditMode: () => void;
}

const ConversationOpsContext = createContext<ConversationOpsValue | null>(null);

function useConversationOps() {
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

function ConversationTitleEditor() {
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
  const history = useOptionalHistory();

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
      await history?.refreshBoth();
      history?.scrollPinnedIntoView();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/conversations/${conversation.id}`, {
        method: "DELETE",
      });
      await history?.refreshBoth();
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

/**
 * A single conversation row for the expanded sidebar — expects a
 * ConversationProvider ancestor and renders inline-title edit + hover actions.
 */
export function ChatMenuRow({
  includingIcon = false,
}: {
  includingIcon?: boolean;
}) {
  const { conversation, editMode } = useConversationOps();

  // useConversation is used for chat page, i.e., transfer conversation from
  // sidebar to chat area.
  const { setConversation } = useConversation();
  const pathname = usePathname();
  const uri = `/chat/${conversation.id}`;

  const handleClick = () => {
    setConversation(conversation);
  };

  return (
    <MenuItem
      actions={<ChatAction />}
      component={Link}
      href={uri}
      onClick={handleClick}
      selected={pathname === uri}
    >
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

/**
 * Collapsed-sidebar entry point: an icon that opens a dropdown listing the
 * current page of pinned / recent conversations. The expanded-sidebar version
 * lives in SidebarSections (which owns the virtualized layout).
 */
export function ChatHistory({ pinned = false }: { pinned?: boolean }) {
  const { collapsed } = useSidebar();
  const title = pinned ? "Pinned" : "Recents";
  const [history, setHistory] = useState<Conversation[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!collapsed) return;
    startTransition(async () => {
      const response = await fetch(
        `/api/conversations?pinned=${pinned}&page=1&limit=30`,
      );
      const conversations = (await response.json()) as Pagination<Conversation>;
      setHistory(conversations.items);
    });
  }, [pinned, collapsed]);

  if (!collapsed) return null;

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
            <ConversationOpsProvider
              conversation={conversation}
              key={conversation.id}
            >
              <ChatMenuRow includingIcon />
            </ConversationOpsProvider>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
