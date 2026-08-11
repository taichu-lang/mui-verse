"use client";

import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import React from "react";
import { TableDesktop } from "./TableDesktop";
import { TableMobile } from "./TableMobile";

export type IdOriented = {
  id: string | number;
};

export interface TableColumn<T> {
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
}

export interface TableProps<T> {
  stickyHeader?: boolean;
  columns: TableColumn<T>[];
  emptyState?: React.ReactNode;
}

export function Table<T extends IdOriented>(props: TableProps<T>) {
  const isMobile = useMobile();

  if (isMobile) {
    return <TableMobile<T> {...props} />;
  }

  return <TableDesktop<T> {...props} />;
}
