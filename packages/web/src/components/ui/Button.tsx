import { cn } from "@mui-verse/ui/utils/cn";
import { ButtonProps, Button as MuiButton } from "@mui/material";

export function Button({
  className,
  variant = "contained",
  size = "medium",
  sx,
  ...props
}: ButtonProps) {
  const classes = {
    contained: "py-2.5 shadow-none",
    outlined: "text-text-primary py-2.5 bg-white",
    text: "",
    large: "",
    medium: "text-base",
    small: "text-sm",
  };

  return (
    <MuiButton
      className={cn(classes[variant], classes[size], className)}
      variant={variant}
      sx={{
        ...sx,
        "&.Mui-disabled": {
          bgcolor: "#C0DED4",
          color: "background.paper",
        },
      }}
      {...props}
    />
  );
}
