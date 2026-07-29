import { ChatIcon, CirclePlusIcon, SearchIcon } from "@/components/icons";
import { searchConversation } from "@/lib/apis/conversation";
import { MessageSearch } from "@/lib/types/chat";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  InfiniteScrollView,
  InfiniteScrollViewHandle,
} from "@mui-verse/ui/components/data";
import {
  Dialog,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
  useDialogContext,
} from "@mui-verse/ui/components/feedback";
import { CloseXIcon } from "@mui-verse/ui/components/icons";
import { Input } from "@mui-verse/ui/components/inputs";
import { MenuItem } from "@mui-verse/ui/components/navigation";
import { useDebounce } from "@mui-verse/ui/hooks/useDebounce";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { DialogContent } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

function NoResult() {
  return (
    <div className="flex items-center gap-2.5 px-2 py-6">
      <SearchIcon />
      <span className="text-sm">No results</span>
    </div>
  );
}

/**
 * Single fuzzy-match row: title on top, matched message snippet beneath.
 * Uses the same MenuItem primitive as the sidebar's ChatMenuRow so the
 * two lists render as one visual system.
 */
function SearchResultRow({ result }: { result: MessageSearch }) {
  const { setOpen } = useDialogContext();

  return (
    <MenuItem
      component={Link}
      href={`/chat/${result.conversation_id}`}
      className="mx-2.5 h-15.5 px-2.5"
      onClick={() => setOpen(false)}
    >
      <ChatIcon />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium">{result.title}</span>
        <span className="text-text-secondary truncate text-xs">
          {result.content}
        </span>
      </div>
    </MenuItem>
  );
}

function NewChatMenu() {
  const { setOpen } = useDialogContext();

  return (
    <MenuItem
      component={Link}
      href={"/chat"}
      className="mx-2.5 mt-2 h-9 shrink-0 px-2.5"
      onClick={() => setOpen(false)}
    >
      <CirclePlusIcon />
      New chat
    </MenuItem>
  );
}

export function SearchButton() {
  const t = useTranslations();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search);

  return (
    // Once the dialog is closed, clear the search input, as the SearchButton
    // will not destroyed.
    <DialogProvider onClose={() => setSearch("")}>
      <DialogTrigger>
        <MenuButton title={t("chat.sidebar.search")} icon={<SearchIcon />} />
      </DialogTrigger>
      <Dialog maxWidth="lg" sx={{ width: "680px", height: "438px" }}>
        <DialogTitle
          enableCloseTrigger={
            <IconGhostButton className="hover:bg-action-hover h-8 w-8">
              <CloseXIcon />
            </IconGhostButton>
          }
          useSeparator={true}
          className="px-4 py-5.5"
        >
          <Input
            fullWidth
            className="ml-3.5 text-base"
            size="small"
            variant="default"
            placeholder={t("chat.sidebar.searchPlaceholder")}
            onValueChange={setSearch}
          />
        </DialogTitle>
        <DialogContent className="p-0">
          {debouncedSearch ? (
            <div className="min-h-0 flex-1">
              <InfiniteSearchView query={debouncedSearch} />
            </div>
          ) : (
            <NewChatMenu />
          )}
        </DialogContent>
      </Dialog>
    </DialogProvider>
  );
}

function InfiniteSearchView({ query }: { query: string }) {
  const ref = useRef<InfiniteScrollViewHandle>(null);

  useEffect(() => {
    ref.current?.refresh();
  }, [query]);

  const fetchMessage = useCallback(() => {
    return async ({
      before,
      after,
      limit,
      signal,
    }: {
      before?: string;
      after?: string;
      limit: number;
      signal: AbortSignal;
    }): Promise<MessageSearch[]> => {
      if (before) {
        return [];
      }

      const from = after ? Number(after) : 0;
      return searchConversation(query, from, limit, signal);
    };
  }, [query]);

  return (
    <InfiniteScrollView<MessageSearch>
      sections={[
        {
          key: "search",
          fetch: fetchMessage(),
          getItemKey: (item) => item.id!.toString(),
          emptyState: <NoResult />,
        },
      ]}
      renderItem={(item) => {
        return <SearchResultRow result={item} />;
      }}
      handleRef={ref}
      className="mt-2.5"
    />
  );
}
