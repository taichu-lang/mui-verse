"use client";

import { AnimatedSpinner } from "@mui-verse/ui/components/effects";
import { Paper } from "@mui/material";
import { IdOriented, TableProps } from "./Table";
import { useTableContext } from "./TableContext";

export function TableMobile<T extends IdOriented>({
  columns,
  emptyState,
}: TableProps<T>) {
  const { rows, loading } = useTableContext();

  if (loading) {
    return (
      <Paper className="rounded-lg p-4">
        <div className="flex">
          {columns.map((column, cid) => (
            <div
              key={`empty-${cid}`}
              className="flex items-center justify-between border-b border-gray-100 py-2 text-sm last:border-b-0"
            >
              {column.header}
            </div>
          ))}
          <div className="flex flex-1 flex-col items-center justify-center">
            <AnimatedSpinner />
          </div>
        </div>
      </Paper>
    );
  }

  if (rows.items.length === 0) {
    if (emptyState) {
      return <div className="rounded-lg p-6">{emptyState}</div>;
    }

    return (
      <Paper className="rounded-lg p-4">
        {columns.map((column, cid) => (
          <div
            key={`empty-${cid}`}
            className="flex items-center justify-between border-b border-gray-100 py-2 text-sm last:border-b-0"
          >
            {column.header}
            <div className="text-right">{"-"}</div>
          </div>
        ))}
      </Paper>
    );
  }

  const items = rows.items as T[];

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, rid) => {
        return (
          <Paper
            key={`row-${item.id}`}
            className="rounded-lg p-4"
            sx={{
              backgroundColor: rid % 2 === 1 ? "grey.100" : "background.paper",
            }}
          >
            {columns.map((column, cid) => (
              <div
                key={`r-${rid}-c-${cid}`}
                className="flex items-center justify-between border-b border-gray-100 py-2 text-sm last:border-b-0"
              >
                {column.header}
                <div className="text-right">{column.render(item)}</div>
              </div>
            ))}
          </Paper>
        );
      })}
    </div>
  );
}
