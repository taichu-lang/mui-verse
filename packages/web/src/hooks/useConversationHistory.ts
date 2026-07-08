"use client";

import { Conversation } from "@/lib/types/chat";
import { Pagination } from "@/lib/types/pagination";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ConversationHistoryState {
  items: Conversation[];
  page: number;
  total: number;
  loading: boolean;
  loadingMore: boolean;
  done: boolean;
  error: unknown;
}

export interface UseConversationHistoryResult extends ConversationHistoryState {
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const INITIAL: ConversationHistoryState = {
  items: [],
  page: 0,
  total: 0,
  loading: false,
  loadingMore: false,
  done: false,
  error: null,
};

/**
 * Paginated fetcher for /api/conversations. Owns items/page/total plus a
 * `done` flag derived from items.length >= total (so onEndReached idempotent
 * short-circuits once we've drained the server).
 *
 * refresh() resets to page 1 and replaces items; loadMore() appends the next
 * page. Both are guarded by an in-flight ref to survive concurrent triggers
 * from the IntersectionObserver sentinel.
 */
export function useConversationHistory(
  pinned: boolean,
  limit = 30,
): UseConversationHistoryResult {
  const [state, setState] = useState<ConversationHistoryState>(INITIAL);
  // Serialize concurrent fetches — the sentinel may fire multiple times as
  // paging expands the container height.
  const inflightRef = useRef(false);

  const fetchPage = useCallback(
    async (page: number) => {
      const url = `/api/conversations?pinned=${pinned}&page=${page}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
      return (await response.json()) as Pagination<Conversation>;
    },
    [pinned, limit],
  );

  const refresh = useCallback(async () => {
    if (inflightRef.current) return;
    inflightRef.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const p = await fetchPage(1);
      setState({
        items: p.items,
        page: p.page ?? 1,
        total: p.total,
        loading: false,
        loadingMore: false,
        done: p.items.length >= p.total,
        error: null,
      });
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error }));
    } finally {
      inflightRef.current = false;
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (inflightRef.current) return;
    // Read fresh state — closures otherwise capture stale `done` / `page`.
    let shouldFetch = false;
    let nextPage = 1;
    setState((s) => {
      if (s.done || s.loading || s.loadingMore) return s;
      shouldFetch = true;
      nextPage = (s.page || 0) + 1;
      return { ...s, loadingMore: true };
    });
    if (!shouldFetch) return;
    inflightRef.current = true;
    try {
      const p = await fetchPage(nextPage);
      setState((s) => {
        const items = [...s.items, ...p.items];
        return {
          items,
          page: p.page ?? nextPage,
          total: p.total,
          loading: false,
          loadingMore: false,
          done: items.length >= p.total || p.items.length === 0,
          error: null,
        };
      });
    } catch (error) {
      setState((s) => ({ ...s, loadingMore: false, error }));
    } finally {
      inflightRef.current = false;
    }
  }, [fetchPage]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    hasNextPage: !state.done,
    loadMore,
    refresh,
  };
}
