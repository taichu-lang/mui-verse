"use client";

import {
  Table as MuiTable,
  Paper,
  styled,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { ColumnDef, RowDef, TableContentProps } from "./Table";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:
      theme.palette.mode === "light"
        ? "var(--mui-palette-secondary-400)"
        : "var(--mui-palette-secondary-500)",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[100],
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function getCellValue(row: RowDef, column: ColumnDef<RowDef>) {
  if (column.render) {
    return column.render(row);
  }
  return row[column.field] as React.ReactNode;
}

export function TableDesktop({ columns, rows }: TableContentProps) {
  const tc = useTranslations("common");

  const renderBody = () => {
    if (rows.items.length === 0) {
      return (
        <StyledTableRow>
          <StyledTableCell colSpan={columns.length} align="center">
            <Typography variant="caption" className="text-[14px]">
              {tc("noData")}
            </Typography>
          </StyledTableCell>
        </StyledTableRow>
      );
    }

    return rows.items.map((item, rid) => {
      const row = item as RowDef;
      return (
        <StyledTableRow key={row.id}>
          {columns.map((column, cid) => {
            if (cid === 0) {
              return (
                <StyledTableCell
                  key={`r-${rid}-c-${cid}`}
                  component="th"
                  scope="row"
                >
                  {getCellValue(row, column)}
                </StyledTableCell>
              );
            }

            return (
              <StyledTableCell
                key={`r-${rid}-c-${cid}`}
                align="center"
                width={column.width ? `${column.width!}%` : ""}
                sx={{
                  maxWidth: `${column.width || 100}vw`,
                }}
              >
                {getCellValue(row, column)}
              </StyledTableCell>
            );
          })}
        </StyledTableRow>
      );
    });
  };

  return (
    <TableContainer component={Paper}>
      <MuiTable stickyHeader size="medium">
        <TableHead>
          <StyledTableRow>
            {columns.map((column, index) => (
              <StyledTableCell
                key={`column-${index}`}
                align={index === 0 ? "left" : "center"}
              >
                {column.headerName}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>{renderBody()}</TableBody>
      </MuiTable>
    </TableContainer>
  );
}
