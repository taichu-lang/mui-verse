"use client";

import { useAuth } from "@/auth/auth";
import { AuthZone } from "@/auth/AuthZone";
import { ChatHistoryDropdown } from "@/components/blocks/history/ChatRow";
import { ConversationListView } from "@/components/blocks/history/ConversationListView";
import { ModelAccordion } from "@/components/blocks/models";
import { UserProfileMenu } from "@/components/blocks/profile";
import { SearchButton } from "@/components/blocks/search";
import { CirclePlusIcon, CollapsedIcon } from "@/components/icons";
import { MenuIntl } from "@mui-verse/ui/layout/MenuIntl";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarToggle,
} from "@mui-verse/ui/layout/Sidebar";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { useLocale } from "next-intl";

function ScrollArea() {
  const { collapsed } = useSidebar();
  const hasAuthorization = useAuth.useHasAuthorization();

  if (hasAuthorization) {
    return (
      <>
        {collapsed ? (
          // Collapsed sidebar keeps the DropdownMenu-based entry points; the
          // virtualized list is only meaningful in the expanded layout.
          <>
            <ModelAccordion />
            <ChatHistoryDropdown pinned />
            <ChatHistoryDropdown />
          </>
        ) : (
          <div className="mb-2 flex min-h-0 flex-1 flex-col">
            <ConversationListView />
          </div>
        )}
      </>
    );
  }

  return (
    <AuthZone>
      <ModelAccordion />
    </AuthZone>
  );
}

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const locale = useLocale();

  return (
    <Sidebar className="border-sidebar-divider gap-0 border-r px-0">
      <SidebarHeader className={collapsed ? "" : "flex justify-between px-2"}>
        {collapsed || (
          <span className="text-xl leading-6 font-semibold">Anna</span>
        )}
        <SidebarToggle icon={<CollapsedIcon />} variant="ghost" />
      </SidebarHeader>
      <AuthZone>
        <div className="flex w-full flex-col items-center px-2">
          <MenuIntl
            href="/chat"
            title="New chat"
            icon={<CirclePlusIcon />}
            locale={locale}
          />
          <SearchButton />
        </div>
      </AuthZone>
      {collapsed || <div className="mt-5" />}
      <ScrollArea />
      <SidebarFooter className={"flex-col pb-0"}>
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
