"use client";

import { IconButton, Tooltip } from "@mui/material";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { IconGhostButton, IconTextButton } from "./IconButton";

export function ClipboardButton({
  onClick,
  variant = "contained",
  className,
}: {
  onClick: () => Promise<void>;
  variant?: "contained" | "text" | "ghost";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const comps: Record<string, React.ElementType> = {
    contained: IconButton,
    text: IconTextButton,
    ghost: IconGhostButton,
  };
  const Comp = comps[variant];

  const handleCopy = async () => {
    if (copied) {
      return;
    }

    await onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy"}>
      <Comp size="small" onClick={handleCopy} className={className}>
        {copied ? (
          <CheckIcon className="text-success-500 h-4 w-4" />
        ) : (
          <CopyIcon className="h-4 w-4" strokeWidth={1.2} />
        )}
      </Comp>
    </Tooltip>
  );
}
