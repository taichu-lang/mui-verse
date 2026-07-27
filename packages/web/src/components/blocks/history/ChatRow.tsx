"use client";

import { ChatIcon, PinnerIcon } from "@/components/icons";
import { useConversation } from "@/hooks/useConversation";
import { usePathname } from "@/i18n/navigation";
import { getConversations } from "@/lib/apis/conversation";
import { Conversation } from "@/lib/types/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuItem,
} from "@mui-verse/ui/components/navigation";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  ChatAction,
  ConversationOpsProvider,
  ConversationTitleEditor,
  useConversationOps,
} from "./ConversationOps";

const MAX_ITEMS_IN_DROPDOWN = 8;

/**
 * A single conversation row for the expanded sidebar — expects a
 * ConversationProvider ancestor and renders inline-title edit + hover actions.
 */
export function ChatMenuRow({
  includingIcon = false,
}: {
  includingIcon?: boolean;
}) {
  const { target, editMode } = useConversationOps();

  // useConversation is used for chat page, i.e., transfer conversation from
  // sidebar to chat area.
  const { setConversation } = useConversation();
  const pathname = usePathname();
  const uri = `/chat/${target.conversation_id}`;

  const handleClick = () => {
    setConversation(target);
  };

  return (
    <MenuItem
      actions={<ChatAction />}
      component={Link}
      href={uri}
      onClick={handleClick}
      selected={pathname === uri}
      className="mb-0.5"
    >
      {includingIcon && <ChatIcon />}
      {editMode ? (
        <ConversationTitleEditor />
      ) : (
        <span className="truncate text-sm">{target.title || "新对话"}</span>
      )}
    </MenuItem>
  );
}

/**
 * Collapsed-sidebar entry point: an icon that opens a dropdown listing the
 * current page of pinned / recent conversations. The expanded-sidebar version
 * lives in SidebarSections (which owns the virtualized layout).
 */
export function ChatHistoryDropdown({ pinned = false }: { pinned?: boolean }) {
  const title = pinned ? "Pinned" : "Recents";
  const [history, setHistory] = useState<Conversation[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const items = await getConversations(0, MAX_ITEMS_IN_DROPDOWN, pinned);
      setHistory(items);
    });
  }, [pinned]);

  if (isPending) {
    return null;
  }

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
        <div className="flex flex-col">
          {history.map((conversation) => (
            <ConversationOpsProvider
              target={conversation}
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
