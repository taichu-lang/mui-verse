"use client";

import { AuthZone } from "@/auth/AuthZone";
import { ChatHistory } from "@/components/blocks/history";
import { HistoryProvider } from "@/components/blocks/history/HistoryProvider";
import { SidebarSections } from "@/components/blocks/history/SidebarSections";
import { ModelAccordion } from "@/components/blocks/models";
import { UserProfileMenu } from "@/components/blocks/profile";
import { SearchButton } from "@/components/blocks/search";
import { CirclePlusIcon } from "@/components/icons";
import { MenuIntl } from "@mui-verse/ui/layout/MenuIntl";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarToggle,
} from "@mui-verse/ui/layout/Sidebar";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { cn } from "@mui-verse/ui/utils/cn";
import { useLocale } from "next-intl";

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const locale = useLocale();

  return (
    <Sidebar className="border-sidebar-divider gap-0 border-r px-0">
      <SidebarHeader className={collapsed ? "" : "flex justify-between px-2"}>
        {collapsed || (
          <span className="text-xl leading-6 font-semibold">Anna</span>
        )}
        <SidebarToggle />
      </SidebarHeader>
      <AuthZone>
        <div
          className={cn("mb-5 flex w-full flex-col items-center px-2", {
            "mb-0": collapsed,
          })}
        >
          <MenuIntl
            href="/chat"
            title="New chat"
            icon={<CirclePlusIcon />}
            locale={locale}
          />
          <SearchButton />
        </div>
      </AuthZone>
      {collapsed ? (
        // Collapsed sidebar keeps the DropdownMenu-based entry points; the
        // virtualized list is only meaningful in the expanded layout.
        <div className="mb-2 flex flex-col items-center gap-1 overflow-y-auto">
          <ModelAccordion />
          <ChatHistory pinned />
          <ChatHistory />
        </div>
      ) : (
        <div className="mb-2 flex min-h-0 flex-1 flex-col">
          <HistoryProvider>
            <SidebarSections />
          </HistoryProvider>
        </div>
      )}
      <SidebarFooter className={"flex-col pb-0"}>
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
