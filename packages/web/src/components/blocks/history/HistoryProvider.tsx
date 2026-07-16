"use client";

import { InfiniteScrollViewHandle } from "@mui-verse/ui/components/data";
import { create } from "zustand";

interface HistoryContextValue {
  scrollRef: React.RefObject<InfiniteScrollViewHandle | null> | null;

  setScrollRef: (ref: React.RefObject<InfiniteScrollViewHandle | null>) => void;
  refreshModels: () => void;
  refreshRecents: () => void;
  refreshPinned: () => void;
  refreshConversations: () => void;
  scrollPinnedIntoView: () => void;
}

export const useHistory = create<HistoryContextValue>()((set, get) => ({
  scrollRef: null,

  setScrollRef: (ref) => set({ scrollRef: ref }),
  refreshModels: () => {
    const ref = get().scrollRef;
    if (!ref?.current) {
      return;
    }

    ref.current.refresh("models");
  },
  refreshRecents: () => {
    const ref = get().scrollRef;
    if (!ref?.current) {
      return;
    }

    ref.current.refresh("recents");
  },
  refreshPinned: () => {
    const ref = get().scrollRef;
    if (!ref?.current) {
      return;
    }

    ref.current.refresh("pinned");
  },
  refreshConversations: () => {
    const ref = get().scrollRef;
    if (!ref?.current) {
      return;
    }

    ref.current.refresh();
  },
  scrollPinnedIntoView: () => {},
}));
