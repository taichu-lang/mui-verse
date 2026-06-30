"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { Button, InputBase } from "@mui/material";
import { ArrowUpIcon } from "lucide-react";
import { useState } from "react";

export function Sender({
  minRows = 3,
  children,
  onSend,
  className,
  inputClassName,
}: {
  minRows?: number;
  children?: React.ReactNode;
  onSend: (text: string) => Promise<void>;
  className?: string;
  inputClassName?: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  const handleSend = async () => {
    if (!text) {
      return;
    }

    setLoading(true);
    setText("");
    await onSend(text);
    setLoading(false);
  };

  const bindKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // e.shiftKey returns whether the shift key is pressed.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      await handleSend();
    }
  };

  return (
    <div
      className={cn(
        "border-divider flex w-full flex-col overflow-y-auto rounded-3xl border pt-4 pr-3.5 pb-3.5 pl-6 outline-none",
        className,
      )}
    >
      <InputBase
        multiline
        minRows={minRows}
        maxRows={minRows + 1}
        placeholder="Ask anything"
        fullWidth
        className={cn(inputClassName)}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={bindKey}
      />
      <div className="flex items-center">
        <div className="flex flex-1 gap-6.5">{children}</div>
        <Button
          className="h-8 w-8 min-w-0 rounded-lg p-0"
          onClick={handleSend}
          disabled={!text || loading}
        >
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
