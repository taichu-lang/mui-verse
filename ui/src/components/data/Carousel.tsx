"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselIndicatorVariant = "dot" | "bar";

export interface CarouselProps {
  /** Slides; each item is free-form content rendered inside a card. */
  items: React.ReactNode[];
  /** Auto-advance interval in ms. Set to 0 to disable. */
  interval?: number;
  /** Click on the carousel to advance to the next slide. */
  clickToNext?: boolean;
  /** Pause auto-advance while hovering. */
  pauseOnHover?: boolean;
  /** Indicator shape: "dot" (width = height) or "bar" (wider). */
  indicatorVariant?: CarouselIndicatorVariant;
  /** Number of stacked cards peeking behind the front one. */
  stackDepth?: number;
  /** Vertical offset (px) between stacked cards. */
  stackOffset?: number;
  /** Controlled active index. */
  activeIndex?: number;
  defaultIndex?: number;
  onChange?: (index: number) => void;
  /** Applied to the card area; give it a height (e.g. "h-80" or aspect-video). */
  className?: string;
  /** Applied to the card wrapper (e.g. rounded corners). Default "rounded-3xl". */
  cardClassName?: string;
}

const INDICATOR_WIDTH: Record<CarouselIndicatorVariant, string> = {
  dot: "w-2",
  bar: "w-6",
};

export function Carousel({
  items,
  interval = 5000,
  clickToNext = true,
  pauseOnHover = true,
  indicatorVariant = "dot",
  stackDepth = 2,
  stackOffset = 20,
  activeIndex,
  defaultIndex = 0,
  onChange,
  className = "h-80",
  cardClassName = "rounded-3xl",
}: CarouselProps) {
  const count = items.length;
  const [inner, setInner] = useState(defaultIndex);
  const [hovering, setHovering] = useState(false);
  const current = (activeIndex ?? inner) % Math.max(count, 1);

  const onChangeRef = useRef(onChange);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      const next = ((index % count) + count) % count;
      setInner(next);
      onChangeRef.current?.(next);
    },
    [count],
  );

  // Restarts whenever the slide changes, so manual/click navigation resets the timer.
  useEffect(() => {
    if (!interval || count < 2 || (pauseOnHover && hovering)) return;
    const timer = setTimeout(() => goTo(current + 1), interval);
    return () => clearTimeout(timer);
  }, [interval, count, current, hovering, pauseOnHover, goTo]);

  if (count === 0) return null;

  return (
    <div
      className="flex flex-col items-center gap-5"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={`relative w-full ${clickToNext ? "cursor-pointer" : ""} ${className}`}
        style={{ marginTop: stackDepth * stackOffset }}
        onClick={clickToNext ? () => goTo(current + 1) : undefined}
      >
        {items.map((item, i) => {
          // 0 = front card; larger = further back in the stack.
          const depth = (i - current + count) % count;
          const visible = depth <= stackDepth;
          return (
            <div
              key={i}
              aria-hidden={depth !== 0}
              className={`absolute inset-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${cardClassName} ${
                depth === 0 ? "" : "pointer-events-none"
              }`}
              style={{
                zIndex: count - depth,
                opacity: visible ? 1 - depth * 0.15 : 0,
                transform: `translateY(${-depth * stackOffset}px) scale(${1 - depth * 0.06})`,
                transformOrigin: "top center",
              }}
            >
              {/* Back cards render their real content; the front card covers all but the top edge. */}
              {item}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2" role="tablist">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
            className={`h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-300 ${
              INDICATOR_WIDTH[indicatorVariant]
            } ${i === current ? "bg-gray-500" : "bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
}
