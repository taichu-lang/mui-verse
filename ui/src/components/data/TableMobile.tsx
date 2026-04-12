"use client";

import { Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { ColumnDef, RowDef, TableContentProps } from "./Table";

function getCellValue(row: RowDef, column: ColumnDef<RowDef>) {
  if (column.render) {
    return column.render(row);
  }
  return row[column.field] as React.ReactNode;
}

export function TableMobile({ columns, rows }: TableContentProps) {
  const tc = useTranslations("common");

  if (rows.items.length === 0) {
    return (
      <Paper className="rounded-lg p-6 text-center">
        <Typography variant="caption" className="text-[14px]">
          {tc("noData")}
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.items.map((item, rid) => {
        const row = item as RowDef;
        return (
          <Paper
            key={row.id ?? rid}
            className="rounded-lg p-4"
            sx={{
              backgroundColor: rid % 2 === 1 ? "grey.100" : "background.paper",
            }}
          >
            {columns.map((column, cid) => (
              <div
                key={`r-${rid}-c-${cid}`}
                className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0"
              >
                <Typography
                  variant="body2"
                  className="mr-4 shrink-0 text-gray-500"
                >
                  {column.headerName}
                </Typography>
                <div className="text-right">{getCellValue(row, column)}</div>
              </div>
            ))}
          </Paper>
        );
      })}
    </div>
  );
}
