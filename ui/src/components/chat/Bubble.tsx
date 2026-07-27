import { cn } from "@mui-verse/ui/utils/cn";
import { Typography } from "@mui/material";
import { Streamdown } from "streamdown";
import { AnnotationAvatarGroup, SearchAnnotation } from "./Annotation";
import { BubbleActions, BubbleCopyAction } from "./BubbleAction";
import { Message } from "./types";

function BubbleUser({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className="group flex w-full flex-col gap-1 pb-1">
      <div className="flex justify-end">
        <div
          data-role="user"
          className={cn(
            "bg-action-hover flex max-w-[85%] rounded-[22px] px-3.5 py-2.5 text-base",
            className,
          )}
        >
          {content}
        </div>
      </div>
      <BubbleActions role="user">
        <BubbleCopyAction />
      </BubbleActions>
    </div>
  );
}

function BubbleAssistant({
  message,
  className,
  streaming,
}: {
  message: Message;
  className?: string;
  streaming?: boolean;
}) {
  if (!message.content) {
    return null;
  }

  return (
    <div
      data-role="assistant"
      className={cn(
        "flex w-full flex-col justify-start gap-2",
        streaming ? "pb-5" : "pb-2.5",
        className,
      )}
    >
      <Streamdown
        linkSafety={{ enabled: false }}
        allowedTags={{
          // some tags such as `id`, `name` will be added prefix, ex: `data-content-id`.
          annotation: ["site_name", "url", "title"],
        }}
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
          annotation: ({ site_name, url, title }) => {
            return (
              <SearchAnnotation
                site_name={site_name as string}
                title={title as string}
                url={url as string}
              />
            );
          },
        }}
      >
        {message.content}
      </Streamdown>
      <BubbleActions
        role="assistant"
        // Using `opacity` rather than condition render, as the behavior of
        // ResizeObserver depends on the height of this component.
        className={streaming ? "opacity-0" : "opacity-100"}
      >
        <BubbleCopyAction />
        <AnnotationAvatarGroup
          annotations={message.annotations}
          className="ml-2.5"
        />
      </BubbleActions>
      {message.interrupted && (
        <p className="text-text-secondary text-sm">
          This message has been stopped.
        </p>
      )}
    </div>
  );
}

export function Bubble({
  message,
  className,
  streaming,
}: {
  message: Message;
  className?: string;
  streaming?: boolean;
}) {
  switch (message.role) {
    case "user":
      return <BubbleUser content={message.content} className={className} />;
    case "assistant":
      return (
        <BubbleAssistant
          message={message}
          className={className}
          streaming={streaming}
        />
      );
    default:
      return null;
  }
}
