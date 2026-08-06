import { ModelMenuItem } from "@/components/blocks/models";
import { useBenefit } from "@/hooks/useBenefit";
import { getConversations } from "@/lib/apis/conversation";
import { Conversation } from "@/lib/types/chat";
import { Model } from "@/lib/types/model";
import {
  InfiniteScrollView,
  InfiniteScrollViewHandle,
} from "@mui-verse/ui/components/data";
import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ChatMenuRow } from "./ChatRow";
import { ConversationOpsProvider } from "./ConversationOps";
import { useHistory } from "./HistoryProvider";

type ConversationItem = Model | Conversation;

export function ConversationListView() {
  const t = useTranslations();
  const ref = useRef<InfiniteScrollViewHandle>(null);
  const { setScrollRef } = useHistory();
  const { getModels, loading } = useBenefit();

  useEffect(() => {
    if (ref.current) {
      setScrollRef(ref);
    }
  }, [setScrollRef]);

  if (loading) {
    return null;
  }

  return (
    <InfiniteScrollView<ConversationItem>
      handleRef={ref}
      className="px-2"
      sections={[
        {
          key: "models",
          getItemKey: (item) => {
            const model = item as Model;
            return model.id;
          },
          fetch: async () => {
            return await getModels();
          },
          collapsible: true,
          marginBottom: 24,
        },
        {
          key: "pinned",
          getItemKey: (item) => {
            const conversation = item as Conversation;
            return conversation.id.toString();
          },
          fetch: async ({ after, limit, signal }) => {
            const from = after ? Number(after) : 0;
            return await getConversations(from, limit, true, signal);
          },
          collapsible: true,
          marginBottom: 24,
          showWhenEmpty: false,
        },
        {
          key: "recents",
          getItemKey: (item) => {
            const conversation = item as Conversation;
            return conversation.id.toString();
          },
          fetch: async ({ after, limit, signal }) => {
            const from = after ? Number(after) : 0;
            return await getConversations(from, limit, false, signal);
          },
          collapsible: true,
          showWhenEmpty: false,
        },
      ]}
      renderItem={(item, meta) => {
        if (meta.sectionKey === "models") {
          return <ModelMenuItem model={item as Model} />;
        }

        return (
          <ConversationOpsProvider target={item as Conversation}>
            <ChatMenuRow />
          </ConversationOpsProvider>
        );
      }}
      renderHeader={(section, { collapsed, toggle }) => (
        <SectionHeader
          title={t(`chat.sidebar.${section}`)}
          collapsed={collapsed}
          onClick={toggle}
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
  title: React.ReactNode;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={
        "text-text-secondary bg-background-paper flex cursor-pointer items-center gap-4 px-2 pb-1.75 text-xs"
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
