"use client";

import {
  ChatActionItems,
  ChatMenuRow,
  ConversationOpsProvider,
} from "@/components/blocks/history";
import { useHistory } from "@/components/blocks/history/HistoryProvider";
import { ModelMenuItem, models, type Model } from "@/components/blocks/models";
import type { Conversation } from "@/lib/types/chat";
import {
  Section,
  VirtualSectionList,
  VirtualSectionListHandle,
} from "@mui-verse/ui/components/data";
import { Loading } from "@mui-verse/ui/components/effects";
import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import { cn } from "@mui-verse/ui/utils/cn";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type SidebarItem =
  | { kind: "model"; model: Model }
  | { kind: "conversation"; conversation: Conversation };

type SectionKey = "models" | "pinned" | "recents";

const SECTION_TITLES: Record<SectionKey, string> = {
  models: "Models",
  pinned: "Pinned",
  recents: "Recents",
};

/**
 * Composes Models / Pinned / Recents into a single VirtualSectionList and
 * wires HistoryProvider's `scrollPinnedIntoView` to the imperative handle.
 */
export function SidebarSections() {
  const { pinned, recents, registerScrollToPinned } = useHistory();
  const handleRef = useRef<VirtualSectionListHandle | null>(null);

  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    models: false,
    pinned: false,
    recents: false,
  });

  const toggle = (id: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [id as SectionKey]: !prev[id as SectionKey],
    }));
  };

  // Registered exactly once when the handle mounts; HistoryProvider fires it
  // after pin/unpin/delete succeed. Auto-expand Pinned so scroll actually
  // lands somewhere visible.
  useEffect(() => {
    registerScrollToPinned(() => {
      setCollapsed((prev) => (prev.pinned ? { ...prev, pinned: false } : prev));
      handleRef.current?.scrollToSection("pinned", { align: "start" });
    });
    return () => registerScrollToPinned(null);
  }, [registerScrollToPinned]);

  const sections = useMemo<Section<SidebarItem>[]>(() => {
    return [
      {
        id: "models",
        title: SECTION_TITLES.models,
        items: models.map<SidebarItem>((m) => ({ kind: "model", model: m })),
        getItemKey: (row) =>
          row.kind === "model" ? row.model.id : `k:${row.kind}`,
        collapsed: collapsed.models,
        onToggleCollapsed: toggle,
      },
      {
        id: "pinned",
        title: SECTION_TITLES.pinned,
        items: pinned.items.map<SidebarItem>((c) => ({
          kind: "conversation",
          conversation: c,
        })),
        getItemKey: (row) =>
          row.kind === "conversation" ? row.conversation.id : `k:${row.kind}`,
        collapsed: collapsed.pinned,
        onToggleCollapsed: toggle,
        hasNextPage: pinned.hasNextPage,
        isLoadingMore: pinned.loadingMore,
        onLoadMore: pinned.loadMore,
        emptyState: <SectionEmpty>No pinned chats</SectionEmpty>,
        loadingIndicator: <SectionSpinner />,
      },
      {
        id: "recents",
        title: SECTION_TITLES.recents,
        items: recents.items.map<SidebarItem>((c) => ({
          kind: "conversation",
          conversation: c,
        })),
        getItemKey: (row) =>
          row.kind === "conversation" ? row.conversation.id : `k:${row.kind}`,
        collapsed: collapsed.recents,
        onToggleCollapsed: toggle,
        hasNextPage: recents.hasNextPage,
        isLoadingMore: recents.loadingMore,
        onLoadMore: recents.loadMore,
        emptyState: <SectionEmpty>No chats yet</SectionEmpty>,
        loadingIndicator: <SectionSpinner />,
      },
    ];
  }, [pinned, recents, collapsed]);

  return (
    <VirtualSectionList<SidebarItem>
      className="h-full px-2"
      sections={sections}
      handleRef={handleRef}
      estimateHeaderSize={28}
      estimateItemSize={36}
      renderItem={(row) => {
        if (row.kind === "model") {
          return <ModelMenuItem model={row.model} />;
        }
        return (
          <ConversationOpsProvider conversation={row.conversation}>
            <ChatMenuRow />
          </ConversationOpsProvider>
        );
      }}
      renderHeader={(section, { collapsed: isCollapsed }) => (
        <SectionHeader
          title={section.title}
          collapsed={isCollapsed}
          onClick={() => section.onToggleCollapsed?.(section.id)}
        />
      )}
    />
  );
}

function SectionHeader({
  title,
  collapsed,
  onClick,
}: {
  title: ReactNode;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={
        "text-text-secondary bg-background-paper flex cursor-pointer items-center gap-4 px-2 pt-2 pb-1.75 text-xs"
      }
      data-collapsed={collapsed ? "true" : undefined}
      onClick={onClick}
    >
      {title}
      <ChevronDownIcon
        className={cn(
          "transition-transform duration-200",
          collapsed && "-rotate-90",
        )}
      />
    </div>
  );
}

function SectionEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="text-text-secondary px-2 py-1 text-xs">{children}</div>
  );
}

function SectionSpinner() {
  return (
    <div className="flex justify-center py-2">
      <Loading />
    </div>
  );
}

// Re-export ChatActionItems for MenuItem action slots consumed elsewhere.
export { ChatActionItems };
