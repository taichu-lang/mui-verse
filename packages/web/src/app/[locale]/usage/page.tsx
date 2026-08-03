"use client";

import { getCreditUsages } from "@/lib/apis/usage";
import { stringifyDate } from "@/lib/time";
import { modelMap } from "@/lib/types/model";
import { Usage, UsageMetadata } from "@/lib/types/usage";
import {
  TableColumn,
  TableContextProvider,
  TablePagination,
} from "@mui-verse/ui/components/data";
import { useLocale } from "next-intl";
import { useCallback } from "react";

function stringifyToken(metadata?: UsageMetadata) {
  if (!metadata) {
    return "-";
  }

  const total = metadata.total_tokens;
  if (!total) {
    return "-";
  }

  if (total < 1000) {
    return total;
  }

  return `${(total / 1000).toFixed(1)}k`;
}

export default function UsagePage() {
  const locale = useLocale();
  const columns: TableColumn<Usage>[] = [
    {
      header: <span className="text-text-primary font-medium">Date</span>,
      render: (row: unknown) => {
        const usage = row as Usage;
        return stringifyDate(usage.created_at, locale);
      },
    },
    {
      header: <span className="text-text-primary font-medium">Feature</span>,
      render: (row: unknown) => {
        const usage = row as Usage;

        if (usage.resource_type !== "model") {
          return "-";
        }

        return "Chat";
      },
      align: "center",
    },
    {
      header: <span className="text-text-primary font-medium">Details</span>,
      render: (row: unknown) => {
        const usage = row as Usage;

        if (usage.resource_type !== "model" || !usage.resource_id) {
          return "-";
        }

        const model = modelMap[usage.resource_id].name || "-";
        return `${stringifyToken(usage.metadata)} (${model})`;
      },
      align: "center",
    },
    {
      header: (
        <span className="text-text-primary font-medium">Change of credits</span>
      ),
      render: (row: unknown) => {
        const usage = row as Usage;

        if (usage.change_type === "increment") {
          return usage.amount;
        }

        return `-${usage.amount}`;
      },
      align: "right",
    },
  ];

  const getUsagesCallback = useCallback(
    async (page: number, limit: number, signal: AbortSignal) => {
      return await getCreditUsages(page, limit, signal);
    },
    [],
  );

  return (
    <TableContextProvider<Usage>
      columns={columns}
      fetch={getUsagesCallback}
      stickyHeader
      className="gap-15"
    >
      <TablePagination placement="center" shape="rounded" />
    </TableContextProvider>
  );
}
