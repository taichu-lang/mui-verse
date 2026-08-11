import { cn } from "@mui-verse/ui/utils/cn";
import { ToggleButton, ToggleButtonProps } from "@mui/material";

export function SplitToggleButton({
  className,
  ...props
}: ToggleButtonProps & { className?: string }) {
  return (
    <ToggleButton
      className={cn("border-divider rounded-md border p-1", className)}
      size="small"
      {...props}
    />
  );
}
