"use client";

import { ChatActionItems } from "@/components/blocks/history";
import { ChevronDownIcon } from "@/components/icons";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { useConversation } from "@mui-verse/ui/components/chat";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";

export function Navbar() {
  const { title } = useConversation();

  return (
    <div className="h-navbar z-navbar sticky top-0 flex w-full shrink-0 items-center bg-white/80 backdrop-blur">
      {title && (
        <>
          <span className="mr-2.5 ml-5 text-base font-medium">{title}</span>
          <DropdownMenu align="end" side="bottom">
            <DropdownMenuTrigger>
              <IconGhostButton className="hover:bg-action-hover h-8 w-8">
                <ChevronDownIcon />
              </IconGhostButton>
            </DropdownMenuTrigger>
            <ChatActionItems />
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
