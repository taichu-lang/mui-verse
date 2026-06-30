import { cn } from "@mui-verse/ui/utils/cn";
import { Streamdown } from "streamdown";
import { Message } from "./types";

function BubbleUser({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className="flex w-full justify-end">
      <div
        data-role="user"
        className={cn(
          "bg-action-hover max-w-[85%] rounded-2xl px-3.5 py-2.5 text-base",
          className,
        )}
      >
        {content}
      </div>
    </div>
  );
}

function BubbleAssistant({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  if (!content) {
    return null;
  }

  return (
    <div
      data-role="assistant"
      className={cn("flex w-full justify-start", className)}
    >
      <Streamdown>{content}</Streamdown>
    </div>
  );
}

export function Bubble({
  message,
  className,
}: {
  message: Message;
  className?: string;
}) {
  switch (message.role) {
    case "user":
      return <BubbleUser content={message.content} className={className} />;
    case "assistant":
      return (
        <BubbleAssistant content={message.content} className={className} />
      );
    default:
      return null;
  }
}
