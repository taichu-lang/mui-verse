"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import {
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
  styled,
} from "@mui/material";
import React from "react";

type Variant = "sm" | "md";

export interface MenuItemProps extends MuiMenuItemProps {
  variant?: Variant;
  actions?: React.ReactNode;
}

type Preset = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  radius: string;
  padding: string;
  margin: string;
};

const presets: Record<Variant, Preset> = {
  sm: {
    fontSize: "14px",
    lineHeight: "18px",
    fontWeight: 400,
    radius: "10px",
    padding: "7px 8px", // height = 32px
    margin: "0",
  },
  md: {
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: 400,
    radius: "10px",
    padding: "14px 8px",
    margin: "0",
  },
};

// When `actions` is provided we need the row's padding to move to an inner
// wrapper so the trailing action slot can sit flush at the edge. When
// `actions` is NOT provided we leave padding on the row itself, so the
// MUI-injected DOM (Select's cloned value, ListItemIcon > child selectors,
// etc.) sees the exact same shape as a plain MuiMenuItem.
const StyledMenuItem = styled(MuiMenuItem, {
  shouldForwardProp: (prop) => prop !== "variant" && prop !== "hasActions",
})<{ variant?: Variant; hasActions?: boolean }>(({
  variant = "sm",
  hasActions = false,
}) => {
  const preset = presets[variant];

  return {
    fontSize: `var(--verse-menu-font-size, ${preset["fontSize"]})`,
    lineHeight: `var(--verse-menu-line-height, ${preset["lineHeight"]})`,
    fontWeight: `var(--verse-menu-font-weight, ${preset["fontWeight"]})`,
    borderRadius: `var(--verse-menu-radius, ${preset["radius"]})`,
    padding: hasActions ? 0 : `var(--verse-menu-padding, ${preset["padding"]})`,
    margin: `var(--verse-menu-margin, ${preset["margin"]})`,
    minHeight: "unset",
    display: "flex",
    alignItems: "center",
    letterSpacing: 0,
    height: "unset",
    color: "var(--mui-palette-text-primary)",

    ...(hasActions && {
      "& .VerseMenuItem-content": {
        flex: 1,
        minWidth: 0,
        padding: `var(--verse-menu-padding, ${preset["padding"]})`,
        display: "flex",
        alignItems: "center",
      },
      "& .VerseMenuItem-actions": {
        padding: 0,
        margin: 0,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        alignSelf: "stretch",
      },
    }),

    // Default style of Divider after MenuItem is:
    //   marginTop: theme.spacing(1)
    //   marginBottom: theme.spacing(1)
    "& + .MuiDivider-root": {
      marginTop: "4px",
      marginBottom: "4px",
    },
  };
});

export function MenuItem({
  variant = "sm",
  children,
  actions,
  className,
  ...rest
}: MenuItemProps) {
  if (actions === undefined) {
    return (
      <StyledMenuItem variant={variant} className={className} {...rest}>
        {children}
      </StyledMenuItem>
    );
  }

  return (
    <StyledMenuItem variant={variant} hasActions {...rest}>
      <div className={cn("VerseMenuItem-content", className)}>{children}</div>
      <div className="VerseMenuItem-actions">{actions}</div>
    </StyledMenuItem>
  );
}
