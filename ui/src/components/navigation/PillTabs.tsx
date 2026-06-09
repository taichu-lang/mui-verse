"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { Tab, type TabProps, Tabs, type TabsProps } from "@mui/material";

export type PillTabsProps = Omit<
  TabsProps,
  "indicatorColor" | "textColor" | "variant"
>;

export function PillTabs({ sx, slotProps, ...rest }: PillTabsProps) {
  return (
    <Tabs
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
      className={cn("h-7 w-16", className)}
      {...rest}
    />
  );
}
