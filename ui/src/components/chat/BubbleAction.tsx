import { ClipboardButton } from "@mui-verse/ui/components/buttons";
import { copyToClipboard } from "@mui-verse/ui/utils/clipboard";
import { cn } from "@mui-verse/ui/utils/cn";
import { useBubble } from "./BubbleContext";
import { MessageRole } from "./types";

export function BubbleCopyAction() {
  const { content } = useBubble();

  const handleCopy = async () => {
    await copyToClipboard(content);
  };

  return (
    <ClipboardButton
      variant="ghost"
      className="hover:bg-action-hover h-8 w-8"
      onClick={handleCopy}
    />
  );
}

export function BubbleActions({
  role,
  children,
  className,
}: {
  role: MessageRole;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center",
        {
          "justify-end opacity-0 group-hover:opacity-100": role === "user",
          "justify-start": role === "assistant",
        },
        className,
      )}
      data-role={role}
    >
      {children}
    </div>
  );
}
