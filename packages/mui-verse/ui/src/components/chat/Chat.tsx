"use client";

import { StreamingIcon } from "@mui-verse/ui/components/icons";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bubble } from "./Bubble";
import { useChatSession } from "./ChatSessionContext";
import { useChatScrollContainer } from "./ChatScrollContext";

export function Conversation({
  bubbleClassName,
  onReachTop,
}: {
  bubbleClassName?: string;
  // Fired when the top sentinel enters the viewport (with a 200px lead), and
  // only while more history exists AND no load is already in flight. Consumers
  // orchestrate the actual fetch + `prependOlder` externally so scroll-anchor
  // preservation can bracket the state update (see useLoadOlder).
  onReachTop?: () => void;
}) {
  const { pending, messages, hasMoreOlder, loadingOlder } = useChatSession();

  // Sentinel just after the last message. scrollIntoView scrolls the nearest
  // scrollable ancestor into view. The sentinel carries a scroll-margin-bottom
  // so it lands above a floating sender rather than underneath it; consumers
  // set --chat-sender-offset on any ancestor to the sender's height (defaults
  // to 0 when not set).
  const endRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollElement = useChatScrollContainer();

  const [initialSettled, setInitialSettled] = useState(false);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 120,
    overscan: 5,
    getItemKey: (index) => messages[index].message_id,
    // Append semantics: when a new message is pushed AND user is already at the
    // bottom, scrollToEnd automatically. Requires anchorTo: "end". Does NOT
    // fire for streaming chunks (last item resizing without a count change) —
    // the ResizeObserver below handles that.
    anchorTo: "end",
    followOnAppend: true,
  });

  const stickToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, []);

  // Re-stick to the end whenever the message area's height changes, but only
  // while auto-stick is warranted: during streaming (assistant bubble grows
  // as chunks arrive; Streamdown may re-flow post-commit for code blocks,
  // math, images), OR during the initial-load window right after hydrate,
  // before the virtualizer has finished measuring bubbles.
  //
  // The initial-load case matters because a one-shot scrollIntoView on
  // hydrate lands on stale geometry: virtualizer starts with
  // estimateSize (120px per row), so getTotalSize() is much smaller than
  // reality; endRef sits at that estimated bottom. As measureElement fires
  // on each rendered bubble, the total grows — but scrollTop doesn't chase
  // it. Observing the message area lets every measurement pass re-park us
  // at the true bottom until things settle.
  useEffect(() => {
    const active = pending || !initialSettled;
    if (!active || !messageAreaRef.current || messages.length === 0) return;
    const observer = new ResizeObserver(stickToEnd);
    observer.observe(messageAreaRef.current);
    return () => observer.disconnect();
  }, [pending, initialSettled, messages.length, stickToEnd]);

  // Release the initial-load auto-stick after two animation frames. One rAF
  // gives the virtualizer a paint to run measureElement on the currently
  // rendered bubbles; the second rAF ensures any resize-triggered re-render
  // has also flushed. After this, further scroll changes are user-driven
  // (except during streaming, which reactivates the observer above) — we
  // must stop auto-sticking so the user can scroll up without being fought.
  useEffect(() => {
    if (initialSettled || messages.length === 0) return;
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setInitialSettled(true));
    });
    return () => cancelAnimationFrame(t);
  }, [initialSettled, messages.length]);

  // Top sentinel — a zero-height marker at offset 0 inside the virtual list.
  // IntersectionObserver fires with a 200px lead so the next page starts
  // fetching before the user actually reaches the top. The observer is
  // recreated when hasMoreOlder flips false so we stop firing at the end of
  // history; the loadingOlder guard is checked at fire time (fresh state read)
  // to avoid closure-stale reads across rapid scroll events.
  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel || !scrollElement || !hasMoreOlder || !onReachTop) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onReachTop();
      },
      { root: scrollElement, rootMargin: "200px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [scrollElement, hasMoreOlder, onReachTop]);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="flex h-full flex-col" ref={messageAreaRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
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
              justifyContent: "center",
              padding: 8,
            }}
          >
            <StreamingIcon />
          </div>
        )}
        {virtualItems.map((vi) => {
          const message = messages[vi.index];
          const isLast = vi.index === messages.length - 1;
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
              <Bubble
                message={message}
                className={bubbleClassName}
                streaming={isLast ? pending : undefined}
              />
            </div>
          );
        })}
      </div>
      {pending && <StreamingIcon />}
      <div
        ref={endRef}
        aria-hidden
        className="h-0 scroll-mb-(--chat-sender-offset,0px)"
      />
    </div>
  );
}
