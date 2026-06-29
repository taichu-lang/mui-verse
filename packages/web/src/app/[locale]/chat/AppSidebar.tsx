"use client";

import { ChatHistory } from "@/components/blocks/history";
import { ModelAccordion } from "@/components/blocks/models";
import { UserProfileMenu } from "@/components/blocks/profile";
import { SearchButton } from "@/components/blocks/search";
import { MenuIntl } from "@mui-verse/ui/layout/MenuIntl";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarToggle,
} from "@mui-verse/ui/layout/Sidebar";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { cn } from "@mui-verse/ui/utils/cn";
import { PlusCircleIcon } from "lucide-react";
import { useLocale } from "next-intl";

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const locale = useLocale();

  return (
    <Sidebar className="border-sidebar-divider gap-0 border-r px-0">
      <SidebarHeader className={collapsed ? "" : "flex justify-between px-2"}>
        {collapsed || <span className="anna-sidebar-brand">Anna</span>}
        <SidebarToggle />
      </SidebarHeader>
      <div
        className={cn("mb-5 flex w-full flex-col items-center px-2", {
          "mb-0": collapsed,
        })}
      >
        <MenuIntl
          href="/chat"
          title="New chat"
          icon={<PlusCircleIcon className="h-4 w-4" />}
          locale={locale}
        />
        <SearchButton />
      </div>
      <div className="mb-2 overflow-y-auto">
        <div className="px-2">
          <ModelAccordion />
          <ChatHistory pinned className="mb-9" />
          <ChatHistory />
        </div>
      </div>
      <SidebarFooter className={"flex-col px-2 pb-0"}>
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
