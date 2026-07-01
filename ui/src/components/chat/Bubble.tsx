import { cn } from "@mui-verse/ui/utils/cn";
import { Typography } from "@mui/material";
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
      <Streamdown
        components={{
          h1: ({ children, ...props }) => (
            <Typography
              {...props}
              variant="h4"
              component={"h1"}
              data-markdown="h1"
            >
              {children}
            </Typography>
          ),
          h2: ({ children, ...props }) => (
            <Typography
              {...props}
              variant="h5"
              component={"h2"}
              data-markdown="h2"
            >
              {children}
            </Typography>
          ),
          h3: ({ children, ...props }) => (
            <Typography
              {...props}
              variant="h6"
              component={"h3"}
              data-markdown="h3"
            >
              {children}
            </Typography>
          ),
          h4: ({ children, ...props }) => (
            <Typography
              {...props}
              variant="subtitle1"
              component={"h4"}
              data-markdown="h4"
            >
              {children}
            </Typography>
          ),
          h5: ({ children, ...props }) => (
            <Typography
              {...props}
              variant="subtitle2"
              component={"h5"}
              data-markdown="h5"
            >
              {children}
            </Typography>
          ),
          p: ({ children, ...props }) => (
            <Typography
              {...props}
              variant="body1"
              component={"p"}
              data-markdown="p"
            >
              {children}
            </Typography>
          ),
        }}
      >
        {content}
      </Streamdown>
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
