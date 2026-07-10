"use client";

import { useChat, useChatScrollContainer } from "@mui-verse/ui/components/chat";
import { useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import type { MessagesPage } from "./messagesPage";

// Orchestrates fetch + store update for the "load older" flow.
//
// Two responsibilities that live here rather than in the mui-verse store:
//
//  1. `flushSync`-bracketed scroll-anchor preservation.  Recording
//     `scrollHeight` before the state update, applying `prependOlder`
//     synchronously via flushSync, then adjusting `scrollTop` by the delta
//     keeps the user's currently-visible content stable when new items are
//     inserted at the head. Without this, prepending N items would shift the
//     viewport up by their combined height.
//
//  2. Atomic in-flight guard via a ref.  IntersectionObserver can fire the
//     sentinel callback multiple times per scroll event; `useChat()` state
//     reads are stale until React re-renders, so a state-based check would
//     let two loads race. The ref is written synchronously.
//
// The hook returns an `onReachTop` callback stable across renders (only
// resubscribes to observer when the conversation id changes).
export function useLoadOlder(conversationId: string | undefined) {
  const { messages, hasMoreOlder, setLoadingOlder, prependOlder } = useChat();
  const scrollElement = useChatScrollContainer();

  const inFlightRef = useRef(false);
  // Latest messages/hasMoreOlder captured in a ref so the returned callback
  // stays referentially stable — otherwise Conversation's IntersectionObserver
  // effect would tear down and rebuild on every store change (i.e. every
  // streaming chunk). Sync happens post-commit; the callback only reads via
  // ref at fire time, which is always after some effect has run.
  const latestRef = useRef({ messages, hasMoreOlder });
  useEffect(() => {
    latestRef.current = { messages, hasMoreOlder };
  });

  // Cancel in-flight fetch if the hook unmounts (Provider remount on
  // navigation) or the conversation id changes.
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [conversationId]);

  return useCallback(() => {
    if (!conversationId) return;
    if (inFlightRef.current) return;
    const { messages, hasMoreOlder } = latestRef.current;
    if (!hasMoreOlder) return;
    const oldest = messages[0];
    // Cursor invariant: only historically-loaded messages carry `id`. If the
    // top of the list has no id, `hasMoreOlder` should already be false; this
    // is a belt-and-braces guard.
    if (!oldest?.id) return;

    inFlightRef.current = true;
    setLoadingOlder(true);

    const scrollEl = scrollElement;
    const beforeHeight = scrollEl?.scrollHeight ?? 0;

    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const params = new URLSearchParams({
          before: oldest.id!,
          limit: "30",
        });
        const res = await fetch(
          `/api/conversations/${conversationId}/messages?${params}`,
          { signal: ac.signal },
        );

        if (!res.ok) {
          setLoadingOlder(false);
          return;
        }
        const data = (await res.json()) as MessagesPage;

        // flushSync guarantees the DOM is updated before we read scrollHeight
        // again, so the delta reflects the actual measured (or estimated)
        // heights of the new items.
        flushSync(() => {
          prependOlder(data.messages, data.has_more);
        });

        if (scrollEl) {
          const afterHeight = scrollEl.scrollHeight;
          // scrollBy (method call) instead of `scrollTop +=` (assignment): the
          // react-hooks/immutability rule flags direct property writes on
          // hook-returned values but not method dispatch. Same effect.
          scrollEl.scrollBy(0, afterHeight - beforeHeight);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.log("failed to load older messages.", err);
        }
        setLoadingOlder(false);
      } finally {
        inFlightRef.current = false;
        if (abortRef.current === ac) abortRef.current = null;
      }
    })();
  }, [conversationId, scrollElement, setLoadingOlder, prependOlder]);
}
