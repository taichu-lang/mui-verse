"use client";

import { StreamingIcon } from "@mui-verse/ui/components/icons";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Bubble, BubbleStreaming } from "./Bubble";
import { useChatSession } from "./ChatSessionContext";
import { Message } from "./types";

type FetchFunc = (params: {
  before?: string;
  after?: string;
  limit: number;
  signal: AbortSignal;
}) => Promise<Message[]>;

export interface ChatListViewHandle {
  scrollToBottom: () => void;
  reload: () => Promise<void>;
}

export function ChatListView({
  fetch,
  handleRef,
  bubbleClassName,
  limit = 30,
  initialHasMoreOlder = false,
  initialHasMoreNewer = false,
  initialScrollTo,
}: {
  fetch: FetchFunc;
  handleRef?: React.Ref<ChatListViewHandle>;
  bubbleClassName?: string;
  limit?: number;
  initialHasMoreOlder?: boolean;
  initialHasMoreNewer?: boolean;
  // Message.id to align at the top of the viewport during the initial-load
  // window (search-jump scenario). When omitted, the list parks at the newest
  // message. The target message must already be present in the initially
  // hydrated `messages`; ids not found in the array are ignored (no scroll).
  // Only consulted on mount — later changes are not observed.
  initialScrollTo?: number;
}) {
  const { pending, messages, prepend, append, reset } = useChatSession();

  const [hasMoreOlder, setHasMoreOlder] = useState(initialHasMoreOlder);
  const [hasMoreNewer, setHasMoreNewer] = useState(initialHasMoreNewer);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [loadingNewer, setLoadingNewer] = useState(false);
  const [initialSettled, setInitialSettled] = useState(false);

  // Sentinel just after the last message. scrollIntoView scrolls the nearest
  // scrollable ancestor into view. The sentinel carries a scroll-margin-bottom
  // so it lands above a floating sender rather than underneath it; consumers
  // set --chat-sender-offset on any ancestor to the sender's height (defaults
  // to 0 when not set).
  const endRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);

  // Latest state captured in a ref so sentinel + handle callbacks stay stable
  // and read fresh values at fire time.
  const latestRef = useRef({
    messages,
    hasMoreOlder,
    hasMoreNewer,
    loadingOlder,
    loadingNewer,
    pending,
  });
  useEffect(() => {
    latestRef.current = {
      messages,
      hasMoreOlder,
      hasMoreNewer,
      loadingOlder,
      loadingNewer,
      pending,
    };
  });

  // Anchor preservation for top prepend: snapshot pre-commit scrollHeight,
  // consumed by useLayoutEffect below.
  const pendingAnchorRef = useRef<number | null>(null);

  // AbortController for the currently in-flight fetch (only one may run at a
  // time — the sentinel/handle callbacks all guard via inFlightRef).
  const inFlightRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      inFlightRef.current?.abort();
      inFlightRef.current = null;
    };
    // Rebind cleanup when the fetch identity changes (e.g. conversation
    // switch) so a stale request cannot commit against the new session.
  }, [fetch]);

  const scrollElement = useChatListViewContainer();

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 120,
    overscan: 5,
    getItemKey: (index) => messages[index].message_id,
    anchorTo: "end",
    followOnAppend: true,
    // measureElement runs in React's commit phase (ref callback). When the
    // measured size differs from the estimate and anchorTo === "end", the
    // virtualizer syncs scrollTop and then calls notify(sync=true). With
    // useFlushSync=true (the default), that calls flushSync(rerender) from
    // inside a lifecycle method — which React refuses whenever it's already
    // rendering (streaming chat re-renders the parent on every token). Turn
    // it off; the async rerender is one frame later but visually identical.
    useFlushSync: false,
  });

  const stickToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, []);

  // Search-jump: snapshot the requested Message.id on mount. Consuming it as
  // a ref (not a live prop read) means later prop changes don't re-trigger
  // the scroll — the target is a one-shot alignment for the initial-load
  // window only. undefined => park at the newest message (default).
  const initialScrollToRef = useRef(initialScrollTo);

  // Search-jump: keep the target message aligned at the top of the viewport
  // while measureElement is still running. `anchorTo: "end"` in the
  // virtualizer proactively parks scrollTop at (totalSize - viewportHeight)
  // on mount, and as each rendered bubble is measured the true total grows —
  // that anchor keeps pulling scrollTop away from our target. Re-scrolling to
  // the target index on every resize fights that until measurement settles.
  const scrollToTarget = useCallback(() => {
    const targetId = initialScrollToRef.current;
    if (targetId == null) return;

    const idx = messages.findIndex((m) => m.id === targetId);
    if (idx < 0) return;
    virtualizer.scrollToIndex(idx, { align: "start" });
  }, [messages, virtualizer]);

  // Re-stick to the end while auto-stick to bottom is warranted: during
  // streaming (the BubbleStreaming grows outside the virtualized list;
  // Streamdown may re-flow post-commit for code blocks, math, images), OR
  // during the initial-load window right after mount when no
  // `initialScrollTo` was requested — the virtualizer starts with
  // estimateSize (120px per row), so getTotalSize() is much smaller than
  // reality; endRef sits at that estimated bottom. As measureElement fires
  // on each rendered bubble, the total grows — but scrollTop doesn't chase
  // it. Observing the message area lets every measurement pass re-park us
  // at the true bottom until things settle. When `initialScrollTo` is set
  // this is skipped in favour of the scrollToTarget observer below;
  // streaming (a new user turn) always overrides regardless of entry mode.
  useEffect(() => {
    const streamActive = pending;
    const initialBottomActive =
      !initialSettled && initialScrollToRef.current == null;
    if (
      (!streamActive && !initialBottomActive) ||
      !messageAreaRef.current ||
      messages.length === 0
    )
      return;
    const observer = new ResizeObserver(stickToEnd);
    observer.observe(messageAreaRef.current);
    return () => observer.disconnect();
  }, [pending, initialSettled, messages.length, stickToEnd]);

  // Mirror observer for the initial-scroll case: re-align the target message
  // to the viewport top on every resize until measurement settles.
  useEffect(() => {
    if (initialSettled || initialScrollToRef.current == null) return;
    if (!messageAreaRef.current || messages.length === 0) return;
    const observer = new ResizeObserver(scrollToTarget);
    observer.observe(messageAreaRef.current);
    return () => observer.disconnect();
  }, [initialSettled, messages.length, scrollToTarget]);

  // Release the initial-load auto-stick after two animation frames. One rAF
  // gives the virtualizer a paint to run measureElement on the currently
  // rendered bubbles; the second rAF ensures any resize-triggered re-render
  // has also flushed.
  useEffect(() => {
    if (initialSettled || messages.length === 0) return;
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setInitialSettled(true));
    });
    return () => cancelAnimationFrame(t);
  }, [initialSettled, messages.length]);

  // When a stream ends, `pending` flips false and the final assistant message
  // is appended in the same commit. The ResizeObserver effect above tears
  // down before the virtualizer measures the newly-committed bubble, so
  // nothing re-parks the scroll to the true bottom. Two rAFs after pending
  // clears: first frame lets measureElement run, second lets the resulting
  // reflow settle, then we stickToEnd once.
  const wasPendingRef = useRef(pending);
  useEffect(() => {
    const was = wasPendingRef.current;
    wasPendingRef.current = pending;
    if (!was || pending) return;
    let f2 = 0;
    const f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(stickToEnd);
    });
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
    };
  }, [pending, stickToEnd]);

  const loadOlder = useCallback(async () => {
    if (initialScrollToRef.current) {
      // If the initial `messages` are middle of the conversation, loadOlder
      // will be triggered once the `messages` are rendered. Then the location
      // of `initialScrollTo` is not correct if older messages are loaded.
      initialScrollToRef.current = undefined;
      return;
    }

    const state = latestRef.current;
    if (state.loadingOlder || !state.hasMoreOlder) return;
    if (inFlightRef.current) return;
    const oldest = state.messages[0];
    if (!oldest?.id) return;

    const ac = new AbortController();
    inFlightRef.current = ac;
    setLoadingOlder(true);

    try {
      const page = await fetch({
        before: oldest.id.toString(),
        limit,
        signal: ac.signal,
      });
      if (ac.signal.aborted) return;

      pendingAnchorRef.current = scrollElement?.scrollHeight ?? 0;
      prepend(page);
      setHasMoreOlder(page.length === limit);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.warn("failed to load older messages.", err);
      }
    } finally {
      if (inFlightRef.current === ac) inFlightRef.current = null;
      setLoadingOlder(false);
    }
  }, [fetch, limit, prepend, scrollElement]);

  const loadNewer = useCallback(async () => {
    const state = latestRef.current;
    // `pending` covers the streaming window as well — the streaming reply
    // sits outside the virtualized list and there is no meaningful "newer"
    // beyond an in-flight tail.
    if (state.pending) return;
    if (state.loadingNewer || !state.hasMoreNewer) return;
    if (inFlightRef.current) return;
    const last = state.messages[state.messages.length - 1];
    if (!last?.id) return;

    const ac = new AbortController();
    inFlightRef.current = ac;
    setLoadingNewer(true);

    try {
      const page = await fetch({
        after: last.id.toString(),
        limit,
        signal: ac.signal,
      });
      if (ac.signal.aborted) return;

      append(page);
      setHasMoreNewer(page.length === limit);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.warn("failed to load newer messages.", err);
      }
    } finally {
      if (inFlightRef.current === ac) inFlightRef.current = null;
      setLoadingNewer(false);
    }
  }, [fetch, limit, append]);

  const reload = useCallback(async () => {
    // Cancel any in-flight paged fetch — reload supersedes it.
    inFlightRef.current?.abort();

    const ac = new AbortController();
    inFlightRef.current = ac;

    try {
      const page = await fetch({ limit, signal: ac.signal });
      if (ac.signal.aborted) return;
      reset(page);
      setHasMoreOlder(page.length === limit);
      setHasMoreNewer(false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.warn("failed to reload messages.", err);
      }
    } finally {
      if (inFlightRef.current === ac) inFlightRef.current = null;
    }
  }, [fetch, limit, reset]);

  // Top sentinel — a zero-height marker at offset 0 inside the virtual list.
  // IntersectionObserver fires with a 200px lead so the next page starts
  // fetching before the user actually reaches the top.
  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel || !scrollElement || !hasMoreOlder) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void loadOlder();
      },
      { root: scrollElement, rootMargin: "200px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [scrollElement, hasMoreOlder, loadOlder]);

  // Bottom sentinel — mirrors the top sentinel for search-jump scenarios.
  useEffect(() => {
    const sentinel = bottomSentinelRef.current;
    if (!sentinel || !scrollElement || !hasMoreNewer) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void loadNewer();
      },
      { root: scrollElement, rootMargin: "0px 0px 200px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [scrollElement, hasMoreNewer, loadNewer]);

  // Scroll-anchor preservation on top prepend. Runs after every commit —
  // cheap short-circuit when nothing is pending.
  useLayoutEffect(() => {
    const before = pendingAnchorRef.current;
    if (before === null || !scrollElement) return;
    pendingAnchorRef.current = null;
    const after = scrollElement.scrollHeight;
    scrollElement.scrollBy(0, after - before);
  }, [messages, scrollElement]);

  useImperativeHandle(
    handleRef,
    () => ({
      scrollToBottom: stickToEnd,
      reload,
    }),
    [stickToEnd, reload],
  );

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = useMemo(
    () => virtualizer.getTotalSize(),
    // getTotalSize reads virtualizer internals that change on measure; call
    // it every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [virtualizer, virtualItems, messages.length],
  );

  return (
    <div className="flex h-full flex-col" ref={messageAreaRef}>
      <div
        style={{
          height: `${totalSize}px`,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          ref={topSentinelRef}
          aria-hidden
          style={{ position: "absolute", top: 0, left: 0, height: 1, width: 1 }}
        />
        {loadingOlder && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "start",
              padding: 8,
            }}
          >
            <StreamingIcon />
          </div>
        )}
        {virtualItems.map((vi) => {
          const message = messages[vi.index];
          return (
            <div
              key={vi.key}
              data-index={vi.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vi.start}px)`,
              }}
            >
              <Bubble message={message} className={bubbleClassName} />
            </div>
          );
        })}
        <div
          ref={bottomSentinelRef}
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 1,
            width: 1,
          }}
        />
        {loadingNewer && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "start",
              padding: 8,
            }}
          >
            <StreamingIcon />
          </div>
        )}
      </div>
      <BubbleStreaming
        ref={endRef}
        className="scroll-mb-(--chat-sender-offset,0px)"
      />
    </div>
  );
}

const ChatListViewContainerContext = createContext<HTMLElement | null>(null);

function useChatListViewContainer() {
  const ctx = useContext(ChatListViewContainerContext);
  return ctx;
}

export function ChatListViewContainer({
  element,
  children,
}: {
  element: HTMLDivElement | null;
  children: React.ReactNode;
}) {
  return (
    <ChatListViewContainerContext.Provider value={element}>
      {children}
    </ChatListViewContainerContext.Provider>
  );
}
