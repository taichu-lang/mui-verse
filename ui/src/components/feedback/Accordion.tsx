"use client";

import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import { cn } from "@mui-verse/ui/utils/cn";
import { useState } from "react";

export function Accordion({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="group mt-2 mb-1.75 flex cursor-pointer items-center gap-4 px-2"
        onClick={() => setExpanded(!expanded)}
        data-collapse={expanded ? undefined : "true"}
      >
        <span className="text-text-secondary text-xs">{title}</span>
        <ChevronDownIcon className="transition-transform duration-300 group-data-collapse:-rotate-90" />
      </div>
      {expanded && children}
    </div>
  );
}
