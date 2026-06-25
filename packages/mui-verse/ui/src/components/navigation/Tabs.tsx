"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import {
  Tabs as MuiTabs,
  Tab,
  TabProps,
  type TabsProps as MuiTabsProps,
} from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

interface TabContextValueProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TabContextValue = createContext<TabContextValueProps | null>(null);

export function useTabContext() {
  const ctx = useContext(TabContextValue);
  if (!ctx) {
    throw new Error(
      "PillTabs compound components must be used within <PillTabs>",
    );
  }

  return ctx;
}

export function TabContext({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState<string>(defaultValue);
  const handleChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  return (
    <TabContextValue.Provider value={{ value, onValueChange: handleChange }}>
      {children}
    </TabContextValue.Provider>
  );
}

export function TabPanel({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { value: selected } = useTabContext();

  if (value === selected) {
    return children;
  }

  return null;
}

export type TabsProps = Omit<MuiTabsProps, "indicatorColor" | "value">;

export function InsetTabs({
  onChange,
  variant = "fullWidth",
  slotProps,
  ...props
}: TabsProps) {
  const { value, onValueChange } = useTabContext();

  const handleChange = (event: React.SyntheticEvent, value: string) => {
    onValueChange(value);
    onChange?.(event, value);
  };

  return (
    <MuiTabs
      value={value}
      onChange={handleChange}
      variant={variant}
      {...props}
      sx={{
        display: "inline-flex",
        minHeight: 0,
        p: 0.5,
        "& .MuiTabs-list": {
          gap: 0.5,
        },
      }}
      slotProps={{
        ...slotProps,
        indicator: {
          ...slotProps?.indicator,
          sx: {
            height: "100%",
            bgcolor: "transparent",
            zIndex: 0,
          },
        },
      }}
    />
  );
}

export function InsetTab({ sx, className, ...props }: TabProps) {
  return (
    <Tab
      disableRipple
      sx={{
        p: 0,
        ...sx,
      }}
      className={cn("hover:text-text-primary h-7 w-16", className)}
      {...props}
    />
  );
}
