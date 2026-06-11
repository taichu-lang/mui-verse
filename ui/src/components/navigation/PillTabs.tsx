"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { Tab, type TabProps, Tabs, type TabsProps } from "@mui/material";
import { useTabContext } from "./Tabs";

export type PillTabsProps = Omit<
  TabsProps,
  "indicatorColor" | "textColor" | "value"
>;

export function PillTabs({
  variant = "fullWidth",
  sx,
  slotProps,
  onChange,
  ...rest
}: PillTabsProps) {
  const { value, onValueChange } = useTabContext();

  const handleChange = (event: React.SyntheticEvent, value: string) => {
    onValueChange(value);
    onChange?.(event, value);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant={variant}
      sx={{
        display: "inline-flex",
        minHeight: 0,
        p: 0.5,
        borderRadius: 9999,
        bgcolor: "background.paper",
        "& .MuiTabs-list": {
          gap: 0.5,
        },
        ...sx,
      }}
      slotProps={{
        ...slotProps,
        indicator: {
          ...slotProps?.indicator,
          sx: {
            height: "100%",
            borderRadius: 9999,
            bgcolor: (theme) => theme.palette.action.hover,
            boxShadow: "var(--mui-shadow-button)",
            zIndex: 0,
          },
        },
      }}
      {...rest}
    />
  );
}

export type PillTabProps = TabProps;

export function PillTab({ sx, className, ...rest }: PillTabProps) {
  return (
    <Tab
      disableRipple
      sx={{
        p: 0,
        zIndex: 1,
        borderRadius: 9999,
        ...sx,
      }}
      className={cn("hover:text-text-primary h-7 w-16", className)}
      {...rest}
    />
  );
}
