"use client";

import {
  UseConversationHistoryResult,
  useConversationHistory,
} from "@/hooks/useConversationHistory";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

interface HistoryContextValue {
  pinned: UseConversationHistoryResult;
  recents: UseConversationHistoryResult;
  /** Refresh both lists back to page 1 in parallel. */
  refreshBoth: () => Promise<void>;
  /** Register the "scroll pinned into view" callback SidebarSections owns. */
  registerScrollToPinned: (fn: (() => void) | null) => void;
  scrollPinnedIntoView: () => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const pinned = useConversationHistory(true);
  const recents = useConversationHistory(false);
  const scrollToPinnedRef = useRef<(() => void) | null>(null);

  const pinnedRefresh = pinned.refresh;
  const recentsRefresh = recents.refresh;

  const refreshBoth = useCallback(async () => {
    await Promise.all([pinnedRefresh(), recentsRefresh()]);
  }, [pinnedRefresh, recentsRefresh]);

  const registerScrollToPinned = useCallback((fn: (() => void) | null) => {
    scrollToPinnedRef.current = fn;
  }, []);

  const scrollPinnedIntoView = useCallback(() => {
    scrollToPinnedRef.current?.();
  }, []);

  const value = useMemo<HistoryContextValue>(
    () => ({
      pinned,
      recents,
      refreshBoth,
      registerScrollToPinned,
      scrollPinnedIntoView,
    }),
    [
      pinned,
      recents,
      refreshBoth,
      registerScrollToPinned,
      scrollPinnedIntoView,
    ],
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return ctx;
}

/**
 * Non-throwing variant for handlers that may run outside the provider.
 *
 * ChatMenuRow / ChatActionItems are mounted in two contexts:
 * 1. Expanded sidebar — wrapped by HistoryProvider, needs refreshBoth() / scrollPinnedIntoView()
 * 2. Collapsed dropdown — no provider, fetches its own data on open, no shared state to refresh
 *
 * This optional hook lets the same action menu work in both without duplication or throwing.
 */
export function useOptionalHistory() {
  return useContext(HistoryContext);
}
