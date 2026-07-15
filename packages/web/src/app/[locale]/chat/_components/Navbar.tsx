"use client";

import {
  ChatActionItems,
  ConversationOpsProvider,
} from "@/components/blocks/history/ConversationOps";
import { useConversation } from "@/hooks/useConversation";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";

export function Navbar() {
  const { conversation } = useConversation();

  return (
    <div className="h-navbar z-navbar sticky top-0 flex w-full shrink-0 items-center bg-white/80 backdrop-blur">
      {conversation?.title && (
        <ConversationOpsProvider conversation={conversation}>
          <span className="mr-2.5 ml-5 text-base font-medium">
            {conversation.title}
          </span>
          <DropdownMenu align="end" side="bottom">
            <DropdownMenuTrigger>
              <IconGhostButton className="hover:bg-action-hover h-8 w-8">
                <ChevronDownIcon />
              </IconGhostButton>
            </DropdownMenuTrigger>
            <ChatActionItems />
          </DropdownMenu>
        </ConversationOpsProvider>
      )}
    </div>
  );
}
