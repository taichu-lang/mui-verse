import { StreamingIcon } from "@mui-verse/ui/components/icons";
import { cn } from "@mui-verse/ui/utils/cn";
import { Typography } from "@mui/material";
import { Streamdown } from "streamdown";
import { AnnotationAvatarGroup, SearchAnnotation } from "./Annotation";
import { BubbleActions, BubbleCopyAction } from "./BubbleAction";
import { BubbleContextProvider, useBubble } from "./BubbleContext";
import { useChatSession } from "./ChatSessionContext";
import { Message } from "./types";

function Markdown({ children }: { children: string }) {
  return (
    <Streamdown
      linkSafety={{ enabled: false }}
      allowedTags={{
        // some tags such as `id`, `name` are builtin, and a prefix will be
        // added, ex: `data-content-id`.
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
      {children}
    </Streamdown>
  );
}

function BubbleUser({ className }: { className?: string }) {
  const { content } = useBubble();

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

function BubbleAssistant({ className }: { className?: string }) {
  const { content, annotations, interrupted } = useBubble();

  return (
    <div
      data-role="assistant"
      className={cn(
        "flex w-full flex-col justify-start gap-2 pb-2.5",
        className,
      )}
    >
      <Markdown>{content}</Markdown>
      <BubbleActions role="assistant">
        <BubbleCopyAction />
        <AnnotationAvatarGroup annotations={annotations} className="ml-2.5" />
      </BubbleActions>
      {interrupted && (
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
}: {
  message: Message;
  className?: string;
}) {
  switch (message.role) {
    case "user":
      return (
        <BubbleContextProvider message={message}>
          <BubbleUser className={className} />
        </BubbleContextProvider>
      );
    case "assistant":
      return (
        <BubbleContextProvider message={message}>
          <BubbleAssistant className={className} />
        </BubbleContextProvider>
      );
    default:
      return null;
  }
}

export function BubbleStreaming({
  className,
  ref,
}: {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { streamingMessage, pending } = useChatSession();

  return (
    <div
      ref={ref}
      data-role="assistant"
      className={cn(
        "mb-10 flex min-h-0 w-full flex-col justify-start gap-5",
        className,
      )}
    >
      {streamingMessage?.content && (
        <Markdown>{streamingMessage.content}</Markdown>
      )}
      {pending && <StreamingIcon />}
    </div>
  );
}
