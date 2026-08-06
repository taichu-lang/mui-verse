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
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

function ScrollArea() {
  const { collapsed } = useSidebar();
  const hasAuthorization = useAuth.useHasAuthorization();

  if (!hasAuthorization) {
    return (
      <AuthZone className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ModelAccordion />
      </AuthZone>
    );
  }

  if (collapsed) {
    // Collapsed sidebar keeps the DropdownMenu-based entry points; the
    // virtualized list is only meaningful in the expanded layout.
    return (
      <>
        <ModelAccordion />
        <ChatHistoryDropdown pinned />
        <ChatHistoryDropdown />
      </>
    );
  }

  return (
    <div className="mb-2 flex min-h-0 flex-1 flex-col">
      <ConversationListView />
    </div>
  );
}

export function AppSidebar() {
  const t = useTranslations();
  const { collapsed } = useSidebar();
  const locale = useLocale();

  return (
    <Sidebar className="border-sidebar-divider gap-0 border-r px-0">
      <SidebarHeader className={collapsed ? "" : "flex justify-between px-2"}>
        {collapsed || (
          <Link href={"/"} className="ml-2 text-xl leading-6 font-semibold">
            Anna
          </Link>
        )}
        <SidebarToggle
          icon={<CollapsedIcon />}
          variant="ghost"
          className="h-8 w-8"
        />
      </SidebarHeader>
      <AuthZone>
        <div className="flex w-full flex-col items-center px-2">
          <MenuIntl
            href="/chat"
            title={t("chat.sidebar.new")}
            icon={<CirclePlusIcon />}
            locale={locale}
          />
          <SearchButton />
        </div>
      </AuthZone>
      {collapsed || <div className="mt-5" />}
      <ScrollArea />
      <SidebarFooter className={"mt-5 flex-col pb-0"}>
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
