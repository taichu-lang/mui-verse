"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import {
  defaultRangeExtractor,
  Range,
  useVirtualizer,
} from "@tanstack/react-virtual";
import { ChevronDownIcon } from "lucide-react";
import {
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

export type SectionId = string;

export interface Section<T> {
  id: SectionId;
  /** Rendered inside the sticky header row. */
  title: ReactNode;
  items: T[];
  /** Stable per-item key (defaults to `String(index)`). */
  getItemKey?: (item: T, index: number) => string;
  collapsed?: boolean;
  /** Toggle affordance; when omitted the chevron is not clickable. */
  onToggleCollapsed?: (id: SectionId) => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  /** Rendered as the section body when items is empty and not loading. */
  emptyState?: ReactNode;
  /** Rendered inside the sentinel row when isLoadingMore. */
  loadingIndicator?: ReactNode;
}

export interface VirtualSectionListHandle {
  scrollToSection: (
    id: SectionId,
    opts?: { align?: "start" | "center" | "end" | "auto" },
  ) => void;
  scrollToTop: () => void;
}

type Row<T> =
  | { kind: "header"; sectionId: SectionId; section: Section<T> }
  | {
      kind: "item";
      sectionId: SectionId;
      item: T;
      itemIndex: number;
      itemKey: string;
    }
  | { kind: "sentinel"; sectionId: SectionId; section: Section<T> }
  | { kind: "empty"; sectionId: SectionId; section: Section<T> };

export interface VirtualSectionListProps<T> {
  sections: Section<T>[];
  renderItem: (
    item: T,
    meta: { sectionId: SectionId; index: number },
  ) => ReactNode;
  renderHeader?: (
    section: Section<T>,
    meta: { collapsed: boolean; active: boolean },
  ) => ReactNode;
  estimateHeaderSize?: number;
  estimateItemSize?: number;
  estimateSentinelSize?: number;
  overscan?: number;
  handleRef?: Ref<VirtualSectionListHandle>;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

// TODO(Leo): use InfiniteScrollView instead.

/**
 * VirtualSectionList — one scroll container for N collapsible sections with
 * sticky section headers, per-section infinite-scroll paging, and stable
 * measurements across collapse / append.
 *
 * Sticky header technique follows the TanStack recipe: force the active header
 * index into every `rangeExtractor` output so it stays rendered while scrolled
 * past, then override its style to `position: sticky; top: 0` (dropping the
 * translateY transform) at render time. Non-active headers use the normal
 * absolute-positioned translate.
 */
export function VirtualSectionList<T>({
  sections,
  renderItem,
  renderHeader,
  estimateHeaderSize = 32,
  estimateItemSize = 36,
  estimateSentinelSize = 1,
  overscan = 6,
  handleRef,
  className,
  ref,
}: VirtualSectionListProps<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const setScrollRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as { current: HTMLDivElement | null }).current = node;
      }
    },
    [ref],
  );

  const { rows, headerIndexBySection, headerIndices } = useMemo(() => {
    const rows: Row<T>[] = [];
    const headerMap = new Map<SectionId, number>();
    const headers: number[] = [];

    for (const section of sections) {
      const headerIdx = rows.length;
      headerMap.set(section.id, headerIdx);
      headers.push(headerIdx);
      rows.push({ kind: "header", sectionId: section.id, section });

      if (section.collapsed) continue;

      const keyFor = section.getItemKey ?? ((_: T, i: number) => String(i));
      for (let i = 0; i < section.items.length; i++) {
        const item = section.items[i];
        rows.push({
          kind: "item",
          sectionId: section.id,
          item,
          itemIndex: i,
          itemKey: keyFor(item, i),
        });
      }

      if (section.hasNextPage) {
        rows.push({ kind: "sentinel", sectionId: section.id, section });
      } else if (
        section.items.length === 0 &&
        !section.isLoadingMore &&
        section.emptyState !== undefined
      ) {
        rows.push({ kind: "empty", sectionId: section.id, section });
      }
    }

    return { rows, headerIndexBySection: headerMap, headerIndices: headers };
  }, [sections]);

  // Track the currently "sticky" header index. rangeExtractor writes to this
  // ref every scroll; the row renderer reads it to switch styling. We use a
  // ref (not state) so scrolling never re-renders the whole list — only the
  // rows the virtualizer actually returns matter, and switching two rows'
  // styles is cheap.
  const activeStickyRef = useRef<number>(headerIndices[0] ?? 0);

  const rangeExtractor = useCallback(
    (range: Range) => {
      if (headerIndices.length === 0) return defaultRangeExtractor(range);
      // Largest header index ≤ startIndex — falls back to the first header
      // when we're above every one (before the list scrolls).
      let active = headerIndices[0];
      for (let i = headerIndices.length - 1; i >= 0; i--) {
        if (headerIndices[i] <= range.startIndex) {
          active = headerIndices[i];
          break;
        }
      }
      activeStickyRef.current = active;
      const next = new Set([active, ...defaultRangeExtractor(range)]);
      return [...next].sort((a, b) => a - b);
    },
    [headerIndices],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => {
      const row = rows[i];
      if (row.kind === "header") return estimateHeaderSize;
      if (row.kind === "sentinel") return estimateSentinelSize;
      return estimateItemSize;
    },
    overscan,
    getItemKey: (i) => {
      const row = rows[i];
      switch (row.kind) {
        case "header":
          return `h:${row.sectionId}`;
        case "item":
          return `i:${row.sectionId}:${row.itemKey}`;
        case "sentinel":
          return `s:${row.sectionId}`;
        case "empty":
          return `e:${row.sectionId}`;
      }
    },
    rangeExtractor,
  });

  useImperativeHandle(
    handleRef,
    () => ({
      scrollToSection: (id, opts) => {
        const idx = headerIndexBySection.get(id);
        if (idx != null) {
          virtualizer.scrollToIndex(idx, { align: opts?.align ?? "start" });
        }
      },
      scrollToTop: () => virtualizer.scrollToIndex(0, { align: "start" }),
    }),
    [virtualizer, headerIndexBySection],
  );

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div
      ref={setScrollRef}
      className={cn("relative overflow-y-auto", className)}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((vi) => {
          const row = rows[vi.index];
          const isActiveHeader =
            row.kind === "header" && vi.index === activeStickyRef.current;

          const baseStyle: React.CSSProperties = isActiveHeader
            ? {
                position: "sticky",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1,
              }
            : {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vi.start}px)`,
              };

          return (
            <div
              key={vi.key}
              data-index={vi.index}
              data-kind={row.kind}
              data-section={row.sectionId}
              ref={virtualizer.measureElement}
              style={baseStyle}
            >
              <RowView
                row={row}
                renderItem={renderItem}
                renderHeader={renderHeader}
                scrollRef={scrollRef}
                active={isActiveHeader}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RowView<T>({
  row,
  renderItem,
  renderHeader,
  scrollRef,
  active,
}: {
  row: Row<T>;
  renderItem: VirtualSectionListProps<T>["renderItem"];
  renderHeader: VirtualSectionListProps<T>["renderHeader"];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
}) {
  switch (row.kind) {
    case "header": {
      const { section } = row;
      const collapsed = !!section.collapsed;
      if (renderHeader) {
        return <>{renderHeader(section, { collapsed, active })}</>;
      }
      return (
        <DefaultHeader
          title={section.title}
          collapsed={collapsed}
          onToggle={
            section.onToggleCollapsed
              ? () => section.onToggleCollapsed!(section.id)
              : undefined
          }
        />
      );
    }
    case "item":
      return (
        <>
          {renderItem(row.item, {
            sectionId: row.sectionId,
            index: row.itemIndex,
          })}
        </>
      );
    case "sentinel":
      return (
        <LoadMoreSentinel
          scrollRef={scrollRef}
          onLoadMore={row.section.onLoadMore}
          isLoading={!!row.section.isLoadingMore}
          loadingIndicator={row.section.loadingIndicator}
        />
      );
    case "empty":
      return <>{row.section.emptyState}</>;
  }
}

function DefaultHeader({
  title,
  collapsed,
  onToggle,
}: {
  title: ReactNode;
  collapsed: boolean;
  onToggle?: () => void;
}) {
  return (
    <div
      className={cn(
        "text-text-secondary bg-background-paper flex cursor-pointer items-center gap-2 py-1 pr-1 pl-2 text-xs",
        !onToggle && "cursor-default",
      )}
      onClick={onToggle}
      data-collapsed={collapsed ? "true" : undefined}
    >
      <span className="flex-1 truncate">{title}</span>
      {onToggle && (
        <ChevronDownIcon
          className={cn(
            "transition-transform duration-200",
            collapsed && "-rotate-90",
          )}
        />
      )}
    </div>
  );
}

function LoadMoreSentinel({
  scrollRef,
  onLoadMore,
  isLoading,
  loadingIndicator,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onLoadMore?: () => void;
  isLoading: boolean;
  loadingIndicator?: ReactNode;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    const root = scrollRef.current;
    if (!node || !root || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isLoading) {
            onLoadMore();
          }
        }
      },
      { root, rootMargin: "200px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // Re-observe when the "which page" callback identity changes so
    // useConversationHistory's page-bound loadMore stays fresh.
  }, [scrollRef, onLoadMore, isLoading]);

  return (
    <div ref={sentinelRef} className="flex min-h-1 items-center justify-center">
      {isLoading && loadingIndicator}
    </div>
  );
}
