"use client";

import { PaginationData } from "@mui-verse/ui/types";
import { cn } from "@mui-verse/ui/utils/cn";
import {
  createContext,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useTransition,
} from "react";
import { IdOriented, Table, TableProps } from "./Table";

interface TableContextValue {
  page: number;
  pages: number;
  loading: boolean;
  rows: PaginationData<IdOriented>;
  setPage: (page: number) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext() {
  const ctx = useContext(TableContext);
  if (!ctx) {
    throw new Error(
      "useTableContext must be used within a TableContextProvider",
    );
  }

  return ctx;
}

export interface TableContextHandle {
  // Redirect to page 1, and fetch rows again.
  reload: () => void;
}

interface TableContextProps<T> extends TableProps<T> {
  rowsPerPage?: number;
  fetch: (
    page: number,
    limit: number,
    signal: AbortSignal,
  ) => Promise<PaginationData<T>>;
  children?: React.ReactNode;
  className?: string;
  ctrlRef?: Ref<TableContextHandle>;
}

export function TableContextProvider<T extends IdOriented>({
  rowsPerPage = 10,
  fetch,
  columns,
  emptyState,
  stickyHeader,
  children,
  className,
  ctrlRef,
}: TableContextProps<T>) {
  const [page, setPageState] = useState<number>(1);
  const [pages, setPagesState] = useState<number>(0);
  const [rows, setRowsState] = useState<PaginationData<T>>({
    total: 0,
    limit: rowsPerPage,
    page,
    items: [],
  });
  const abortRef = useRef<AbortController | null>(null);
  const [loading, startTransition] = useTransition();

  const setPage = useCallback((p: number) => {
    setPageState(p);
  }, []);

  const fetchRows = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    startTransition(async () => {
      try {
        const rows = await fetch(page, rowsPerPage, controller.signal);
        if (controller.signal.aborted) return;

        setRowsState(rows);
        setPagesState(Math.ceil(rows.total / rowsPerPage));
      } catch (err) {
        if (controller.signal.aborted) return;
        throw err;
      }
    });
  }, [page, rowsPerPage, fetch]);

  useEffect(() => {
    fetchRows();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchRows]);

  useImperativeHandle(ctrlRef, () => ({
    reload: () => {
      if (page === 1) {
        fetchRows();
      } else {
        setPageState(1);
      }
    },
  }));

  return (
    <TableContext.Provider value={{ page, setPage, loading, pages, rows }}>
      <div className={cn("flex w-full flex-col", className)}>
        <Table
          columns={columns}
          emptyState={emptyState}
          stickyHeader={stickyHeader}
        />
        {children}
      </div>
    </TableContext.Provider>
  );
}
