"use client";

import { AnimatedSpinner } from "@mui-verse/ui/components/effects";
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  tableCellClasses,
  TableCellProps,
  TableRowProps,
} from "@mui/material";
import { IdOriented, TableColumn } from "./Table";
import { useTableContext } from "./TableContext";

export function TableDesktop<T extends IdOriented>({
  stickyHeader,
  columns,
}: {
  stickyHeader?: boolean;
  columns: TableColumn<T>[];
  emptyState?: React.ReactNode;
}) {
  return (
    <MuiTable stickyHeader={stickyHeader} size="medium">
      <TableHead columns={columns} />
      <MuiTableBody>
        <TableBody columns={columns} />
      </MuiTableBody>
    </MuiTable>
  );
}

function TableHead<T>({ columns }: { columns: TableColumn<T>[] }) {
  return (
    <MuiTableHead>
      <TableRow>
        {columns.map((column, index) => (
          <TableCell
            key={`head-${index}`}
            sx={{}}
            align={column.align || "left"}
          >
            {column.header}
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
}

function TableBody<T extends IdOriented>({
  columns,
  emptyState,
}: {
  columns: TableColumn<T>[];
  emptyState?: React.ReactNode;
}) {
  const { loading, rows } = useTableContext();

  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          <div className="flex justify-center">
            <AnimatedSpinner />
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (rows.items.length === 0) {
    if (emptyState) {
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          {emptyState}
        </TableCell>
      </TableRow>;
    }

    return (
      <TableRow>
        {columns.map((c, index) => (
          <TableCell key={`empty-${index}`} align={c.align || "left"}>
            {"-"}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  const items = rows.items as T[];
  return items.map((item) => (
    <TableRow key={`row-${item.id}`}>
      {columns.map((column, ci) => {
        const align = column.align || "left";
        if (ci === 0) {
          <TableCell
            key={`row-${item.id}-cell-${ci}`}
            align={align}
            component="th"
            scope="row"
            width={column.width}
          >
            {column.render(item)}
          </TableCell>;
        }

        return (
          <TableCell
            key={`row-${item.id}-cell-${ci}`}
            align={align}
            width={column.width}
          >
            {column.render(item)}
          </TableCell>
        );
      })}
    </TableRow>
  ));
}

function TableRow({ sx, ...props }: TableRowProps) {
  return (
    <MuiTableRow
      {...props}
      sx={{
        "&:nth-of-type(even)": {
          bgcolor: "grey.100",
        },
        "&:last-child td, &:last-child th": {
          border: 0,
        },
        ...sx,
      }}
    />
  );
}

function TableCell({ sx, ...props }: TableCellProps) {
  return (
    <MuiTableCell
      {...props}
      sx={{
        [`&.${tableCellClasses.head}`]: {
          bgcolor: "var(--mui-table-head-bg, var(--mui-palette-secondary-500))",
          fontSize: "14px",
          lineHeight: "18px",
          fontWeight: "medium",
          color: "white",
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: "14px",
          lineHeight: "18px",
        },
        ...sx,
      }}
    />
  );
}
