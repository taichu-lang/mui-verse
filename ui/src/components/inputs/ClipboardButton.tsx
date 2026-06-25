"use client";

import { copyToClipboard } from "@mui-verse/ui/utils/clipboard";
import { IconButton, Tooltip } from "@mui/material";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function ClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip title={copied ? "Copied!" : "Copy"}>
      <IconButton size="small" onClick={handleCopy}>
        {copied ? (
          <Check className="text-success-500 h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4 text-gray-700" />
        )}
      </IconButton>
    </Tooltip>
  );
}
