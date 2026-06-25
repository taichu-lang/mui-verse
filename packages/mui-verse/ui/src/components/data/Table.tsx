"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { type PaginationData } from "@mui-verse/ui/types";
import { Box, TableProps as MuiTableProps } from "@mui/material";
import React from "react";
import { Pagination } from "./Pagination";
import { TableDesktop } from "./TableDesktop";
import { TableMobile } from "./TableMobile";

export interface RowDef {
  id: string | number;
  [key: string]: React.ReactNode;
}

export interface ColumnDef<T> {
  field: string;
  headerName: string;
  render?: (row: T) => React.ReactNode;
  width?: number;
}

export interface TableContentProps {
  columns: ColumnDef<RowDef>[];
  rows: PaginationData<unknown>;
}

export type TableProps = MuiTableProps & {
  columns: ColumnDef<RowDef>[];
  onPageSwitch: (page: number) => void;
  rows: PaginationData<unknown>;
};

const TableMemo = (props: TableProps) => {
  const { columns, onPageSwitch, rows } = props;
  const pages = Math.ceil(rows.total / (rows.limit || 10));
  const isMobile = useMobile();
  const tableRef = React.useRef<HTMLDivElement>(null);

  const handlePageSwitch = (page: number) => {
    onPageSwitch(page);
    if (isMobile && tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={tableRef} className="mb-4 flex w-full flex-col gap-4">
      {isMobile ? (
        <TableMobile columns={columns} rows={rows} />
      ) : (
        <TableDesktop columns={columns} rows={rows} />
      )}

      <Box display={"flex"} flexDirection={"row-reverse"}>
        {pages > 0 && (
          <Pagination
            count={pages}
            color="error"
            page={rows.page!}
            onChange={(_, page) => handlePageSwitch(page)}
          />
        )}
      </Box>
    </div>
  );
};

export const Table = React.memo(TableMemo);
