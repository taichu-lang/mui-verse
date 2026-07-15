"use client";

import { InfiniteScrollViewHandle } from "@mui-verse/ui/components/data";
import { create } from "zustand";

interface HistoryContextValue {
  scrollRef: React.RefObject<InfiniteScrollViewHandle | null> | null;

  refreshRecents: () => Promise<void>;
  refreshPinned: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  scrollPinnedIntoView: () => void;
}

export const useHistory = create<HistoryContextValue>()((set) => ({
  scrollRef: null,

  refreshRecents: async () => {},
  refreshPinned: async () => {},
  refreshConversations: async () => {},
  scrollPinnedIntoView: () => {},
}));
