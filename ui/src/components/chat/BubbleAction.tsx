import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { CopyIcon } from "@mui-verse/ui/components/icons";
import { cn } from "@mui-verse/ui/utils/cn";
import { MessageRole } from "./types";

export function BubbleCopyAction() {
  return (
    <IconGhostButton className="hover:bg-action-hover h-8 w-8">
      <CopyIcon />
    </IconGhostButton>
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
