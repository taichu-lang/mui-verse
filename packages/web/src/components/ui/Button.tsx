import { cn } from "@mui-verse/ui/utils/cn";
import { ButtonProps, Button as MuiButton } from "@mui/material";

export function Button({
  className,
  variant = "contained",
  sx,
  ...props
}: ButtonProps) {
  const classes = {
    contained: "text-base font-medium py-2.5 shadow-none",
    outlined: "text-text-primary py-2.5 text-base bg-white",
    text: "",
  };

  return (
    <MuiButton
      className={cn(className, classes[variant])}
      variant={variant}
      sx={{
        ...sx,
        "&.Mui-disabled": {
          bgcolor: "primary.light",
          color: "background.paper",
        },
      }}
      {...props}
    />
  );
}
