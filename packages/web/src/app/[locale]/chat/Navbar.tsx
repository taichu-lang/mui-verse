"use client";

import { ChatActionItems } from "@/components/blocks/history";
import { ChevronDownIcon } from "@/components/icons";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/navigation";

export function Navbar() {
  return (
    <div className="h-navbar z-navbar sticky top-0 flex w-full shrink-0 items-center bg-white/80 backdrop-blur">
      <span className="mr-2.5 ml-5 text-base font-medium">
        Free, commercially usable icon libraries
      </span>
      <DropdownMenu align="end" side="bottom">
        <DropdownMenuTrigger>
          <IconGhostButton className="hover:bg-action-hover rounded-lg p-1.75">
            <ChevronDownIcon />
          </IconGhostButton>
        </DropdownMenuTrigger>
        <ChatActionItems />
      </DropdownMenu>
    </div>
  );
}
