"use client";

import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@mui-verse/ui/utils/cn";
import { ChevronUpIcon } from "lucide-react";
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
        className="mt-2 mb-1.75 flex cursor-pointer items-center gap-4 px-2"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-text-secondary text-xs">{title}</span>
        {expanded ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronUpIcon className="h-4 w-4" />
        )}
      </div>
      {expanded && children}
    </div>
  );
}
