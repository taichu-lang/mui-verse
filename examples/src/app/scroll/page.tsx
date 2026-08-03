"use client";

import {
  InfiniteScrollView,
  type InfiniteScrollViewHandle,
} from "@mui-verse/ui/components/data";
import { useRef, useState } from "react";

interface Row {
  id: number;
  label: string;
}

// Simulated "universe" of items. Cursors are numeric string ids. `before`
// returns items with id < before, in ascending order; `after` returns items
// with id > after, in ascending order. `neither` returns from a fixed floor.
function makeFetch({
  min,
  max,
  labelPrefix,
  delayMs = 250,
}: {
  min: number;
  max: number;
  labelPrefix: string;
  delayMs?: number;
}) {
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
  }): Promise<Row[]> => {
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, delayMs);
      signal.addEventListener("abort", () => {
        clearTimeout(t);
        reject(new DOMException("aborted", "AbortError"));
      });
    });

    let start: number;
    let end: number;
    if (before != null) {
      const b = Number(before);
      end = Math.min(b - 1, max);
      start = Math.max(min, end - limit + 1);
    } else if (after != null) {
      const a = Number(after);
      start = Math.max(a + 1, min);
      end = Math.min(max, start + limit - 1);
    } else {
      start = min;
      end = Math.min(max, min + limit - 1);
    }

    if (start > end) return [];
    const items: Row[] = [];
    for (let i = start; i <= end; i++) {
      items.push({ id: i, label: `${labelPrefix} ${i}` });
    }
    return items;
  };
}

type Mode =
  | "single-from-top"
  | "single-middle-jump"
  | "multi-section"
  | "collapsible"
  | "empty";

export default function InfiniteScrollPage() {
  const [mode, setMode] = useState<Mode>("single-from-top");
  const handleRef = useRef<InfiniteScrollViewHandle>(null);

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            "single-from-top",
            "single-middle-jump",
            "multi-section",
            "collapsible",
            "empty",
          ] as Mode[]
        ).map((m) => (
          <button
            key={m}
            className={`rounded border px-2 py-1 text-sm ${
              mode === m ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
        <button
          className="rounded border bg-white px-2 py-1 text-sm"
          onClick={() => handleRef.current?.refresh()}
        >
          refresh all
        </button>
        <button
          className="rounded border bg-white px-2 py-1 text-sm"
          onClick={() => handleRef.current?.scrollToTop()}
        >
          scroll top
        </button>
      </div>

      <div className="min-h-0 flex-1 rounded border">
        <InfiniteScrollViewFor mode={mode} handleRef={handleRef} />
      </div>
    </div>
  );
}

function InfiniteScrollViewFor({
  mode,
  handleRef,
}: {
  mode: Mode;
  handleRef: React.RefObject<InfiniteScrollViewHandle | null>;
}) {
  const commonRender = {
    renderItem: (item: Row) => (
      <div className="border-b px-3 py-2 text-sm">{item.label}</div>
    ),
    loadingIndicator: <div className="text-xs text-gray-500">loading…</div>,
  };

  const renderHeader = (
    key: string,
    { collapsed, toggle }: { collapsed: boolean; toggle: () => void },
  ) => (
    <div
      className="flex cursor-pointer items-center gap-2 border-b bg-gray-100 px-3 py-1 text-xs font-medium"
      onClick={toggle}
    >
      <span>{collapsed ? "▶" : "▼"}</span>
      <span>{key}</span>
      <button
        className="ml-auto text-blue-500"
        onClick={(e) => {
          e.stopPropagation();
          handleRef.current?.refresh(key);
        }}
      >
        refresh
      </button>
    </div>
  );

  if (mode === "single-from-top") {
    return (
      <InfiniteScrollView<Row>
        className="h-full"
        handleRef={handleRef}
        sections={[
          {
            key: "all",
            fetch: makeFetch({ min: 1, max: 200, labelPrefix: "Row" }),
            getItemKey: (r) => String(r.id),
          },
        ]}
        {...commonRender}
      />
    );
  }

  if (mode === "single-middle-jump") {
    // Start centered around id=100 by asking for items after 99. Both
    // sentinels will be active — top loads with before=<top item id>.
    return (
      <InfiniteScrollView<Row>
        className="h-full"
        handleRef={handleRef}
        sections={[
          {
            key: "middle",
            fetch: makeFetch({ min: 1, max: 200, labelPrefix: "Row" }),
            getItemKey: (r) => String(r.id),
            initialCursor: { after: "99" },
          },
        ]}
        {...commonRender}
      />
    );
  }

  if (mode === "multi-section") {
    return (
      <InfiniteScrollView<Row>
        className="h-full"
        handleRef={handleRef}
        renderHeader={renderHeader}
        sections={[
          {
            key: "pinned",
            fetch: makeFetch({ min: 1, max: 25, labelPrefix: "Pinned" }),
            getItemKey: (r) => String(r.id),
            marginBottom: 16,
          },
          {
            key: "recent",
            fetch: makeFetch({ min: 1, max: 100, labelPrefix: "Recent" }),
            getItemKey: (r) => String(r.id),
            marginTop: 12,
            marginBottom: 24,
          },
          {
            key: "archived",
            fetch: makeFetch({ min: 1, max: 400, labelPrefix: "Archived" }),
            getItemKey: (r) => String(r.id),
            marginTop: 20,
          },
        ]}
        {...commonRender}
      />
    );
  }

  if (mode === "collapsible") {
    return (
      <InfiniteScrollView<Row>
        className="h-full"
        handleRef={handleRef}
        renderHeader={renderHeader}
        sections={[
          {
            key: "group-a",
            fetch: makeFetch({ min: 1, max: 60, labelPrefix: "A" }),
            getItemKey: (r) => String(r.id),
            collapsible: true,
          },
          {
            key: "group-b",
            fetch: makeFetch({ min: 1, max: 60, labelPrefix: "B" }),
            getItemKey: (r) => String(r.id),
            collapsible: true,
            defaultCollapsed: true,
          },
        ]}
        {...commonRender}
      />
    );
  }

  // empty: server returns 0 items
  return (
    <InfiniteScrollView<Row>
      className="h-full"
      handleRef={handleRef}
      renderHeader={renderHeader}
      sections={[
        {
          key: "empty",
          fetch: async () => [],
          getItemKey: (r) => String(r.id),
          emptyState: (
            <div className="p-4 text-center text-sm text-gray-500">
              nothing here
            </div>
          ),
        },
      ]}
      {...commonRender}
    />
  );
}
