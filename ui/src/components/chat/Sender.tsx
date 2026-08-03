"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { Button, InputBase } from "@mui/material";
import { ArrowUpIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useChatSession } from "./ChatSessionContext";

export function Sender({
  minRows = 3,
  maxRows,
  children,
  onSend,
  className,
  inputClassName,
}: {
  minRows?: number;
  maxRows?: number;
  children?: React.ReactNode;
  onSend: (text: string, controller: AbortController) => Promise<void>;
  className?: string;
  inputClassName?: string;
}) {
  const { pending, stopStreaming, streaming } = useChatSession();
  const [text, setText] = useState<string>("");
  const abortCtrlRef = useRef<AbortController>(null);

  const handleSend = async () => {
    if (!text.trim() || pending) {
      return;
    }

    const controller = new AbortController();
    abortCtrlRef.current = controller;

    setText("");
    await onSend(text, abortCtrlRef.current);
  };

  const handleAbort = () => {
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
      stopStreaming(true);
    }
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
        "flex w-full flex-col overflow-y-auto rounded-3xl",
        className,
      )}
    >
      <div className="px-6 py-4">
        <InputBase
          multiline
          minRows={minRows}
          maxRows={maxRows}
          placeholder="Ask anything"
          fullWidth
          className={cn(inputClassName)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={bindKey}
          sx={{
            padding: 0,
          }}
        />
      </div>
      <div className="mb-3.5 flex items-center pr-3.5 pl-6">
        <div className="flex flex-1 gap-6.5">{children}</div>
        {streaming ? (
          <Button
            className="h-8 w-8 min-w-0 rounded-full p-0"
            onClick={handleAbort}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1.77734"
                y="1.77783"
                width="12.4444"
                height="12.4444"
                rx="2"
                fill="white"
              />
            </svg>
          </Button>
        ) : (
          <Button
            className="h-8 w-8 min-w-0 rounded-lg p-0"
            onClick={handleSend}
            disabled={!text || pending}
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
