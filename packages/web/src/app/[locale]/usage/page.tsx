"use client";

import { getCreditUsages } from "@/lib/apis/usage";
import { stringifyDate } from "@/lib/time";
import { modelMap } from "@/lib/types/model";
import { Pagination } from "@/lib/types/pagination";
import { Usage, UsageMetadata } from "@/lib/types/usage";
import { ColumnDef, Table } from "@mui-verse/ui/components/data";
import { Loading } from "@mui-verse/ui/components/effects";
import { useLocale } from "next-intl";
import { useEffect, useState, useTransition } from "react";

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
  const [page, setPage] = useState<number>(1);
  const [usages, setUsages] = useState<Pagination<Usage>>({
    total: 0,
    page,
    limit: 10,
    items: [],
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const items = await getCreditUsages(page);
      setUsages(items);
    });
  }, [page]);

  const columns: ColumnDef<unknown>[] = [
    {
      field: "",
      headerName: "Date",
      render: (row: unknown) => {
        const usage = row as Usage;
        return stringifyDate(usage.created_at, locale);
      },
    },
    {
      field: "",
      headerName: "Feature",
      render: (row: unknown) => {
        const usage = row as Usage;

        if (usage.resource_type !== "model") {
          return "-";
        }

        return "Chat";
      },
    },
    {
      field: "",
      headerName: "Details",
      render: (row: unknown) => {
        const usage = row as Usage;

        if (usage.resource_type !== "model" || !usage.resource_id) {
          return "-";
        }

        const model = modelMap[usage.resource_id].name || "-";
        return `${stringifyToken(usage.metadata)} (${model})`;
      },
    },
    {
      field: "",
      headerName: "Change of credits",
      render: (row: unknown) => {
        const usage = row as Usage;

        if (usage.change_type === "increment") {
          return usage.amount;
        }

        return `-${usage.amount}`;
      },
    },
  ];

  if (isPending) {
    return <Loading />;
  }

  return <Table columns={columns} rows={usages} onPageSwitch={setPage} />;
}
