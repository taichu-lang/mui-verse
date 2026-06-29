import {
  DialogProps,
  Dialog as MuiDialog,
} from "@mui-verse/ui/components/feedback";

export function Dialog({ maxWidth = "sm", ...props }: DialogProps) {
  return (
    <MuiDialog
      maxWidth={maxWidth}
      {...props}
      sx={{
        boxShadow: "none",
      }}
    />
  );
}
