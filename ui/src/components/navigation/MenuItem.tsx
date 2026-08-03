"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import {
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
  styled,
} from "@mui/material";
import React from "react";

type Variant = "sm" | "md";

/**
 * Polymorphic `MenuItem` props.
 *
 * The generic `C` mirrors MUI's own multi-polymorphic API: pass `component={SomeComponent}`
 * (or `component="a"`, etc.) and TypeScript will surface that element's DOM attributes
 * (e.g. `href` for `<a>` / Next `Link`). Defaults to `"li"` — the same default as MUI's
 * `MenuItem` — so consumers that don't set `component` get the historical typing.
 *
 * Note on the `Omit<..., "component"> & { component?: C }` trick: MUI's own
 * `MenuItemProps` widens `component` back to `React.ElementType | undefined` at
 * the tail of its type, which prevents TS from inferring `C` from a value like
 * `component={Link}`. Narrowing `component` to `C` here restores the inference,
 * which is how the polymorphic `href` prop becomes visible to callers.
 *
 * We layer `variant` / `actions` on the outside (via intersection) instead of
 * threading them through MUI's `AdditionalProps` slot — the latter can collide
 * with a `variant` field already present on the target `C` (e.g. a `<button>`
 * from some libraries), producing a `never` intersection.
 */
export type MenuItemProps<C extends React.ElementType = "li"> = Omit<
  MuiMenuItemProps<C>,
  "component"
> & {
  component?: C;
  variant?: Variant;
  actions?: React.ReactNode;
};

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
    padding: `var(--verse-menu-padding, ${preset["padding"]})`,
    margin: `var(--verse-menu-margin, ${preset["margin"]})`,
    minHeight: "unset",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    letterSpacing: 0,
    height: "unset",
    color: "var(--mui-palette-text-primary)",
    flexShrink: 0,

    ...(hasActions && {
      "& .VerseMenuItem-content": {
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
      },
      "& .VerseMenuItem-actions": {
        padding: 0,
        margin: 0,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
      },
    }),

    "&.Mui-selected": {
      backgroundColor: "var(--mui-palette-action-hover)",
      "&:hover": {
        backgroundColor: "var(--mui-palette-action-hover)",
      },
    },

    // Default style of Divider after MenuItem is:
    //   marginTop: theme.spacing(1)
    //   marginBottom: theme.spacing(1)
    "& + .MuiDivider-root": {
      marginTop: "4px",
      marginBottom: "4px",
    },
  };
});

export function MenuItem<C extends React.ElementType = "li">({
  variant = "sm",
  children,
  actions,
  className,
  ...props
}: MenuItemProps<C>) {
  // `StyledMenuItem` is `styled(MuiMenuItem)` and its type is narrowed to the
  // default `<li>` root — but at runtime MUI's `MenuItem` handles the
  // `component` prop and forwards everything to whatever element the caller
  // chose. Cast so TS accepts the spread while preserving the polymorphic
  // typing on the outer `MenuItem`.
  // const passthrough = rest as MuiMenuItemProps;

  if (actions === undefined) {
    return (
      <StyledMenuItem
        variant={variant}
        className={cn("gap-2.5", className)}
        {...props}
      >
        {children}
      </StyledMenuItem>
    );
  }

  const preset = presets[variant];

  // Note that actions can not be children of MenuItem, as MenuItem could be rendered
  // as any element based on its component prop. Meanwhile, actions could be any
  // element. Ex: if component of MenuItem is `a`, actions is button, it will be issue
  // of accessibility.
  return (
    <div
      className={cn(
        "group hover:bg-action-hover flex w-full items-center",
        className,
      )}
      style={{
        borderRadius: preset["radius"],
      }}
    >
      <StyledMenuItem
        variant={variant}
        hasActions
        {...props}
        className="flex-1 gap-2.5"
      >
        {children}
      </StyledMenuItem>
      {actions}
    </div>
  );
}
