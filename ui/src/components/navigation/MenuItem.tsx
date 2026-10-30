"use client";

import { extendClickable, TriggerProps } from "@mui-verse/ui/utils/click";
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
  actions?: React.ReactElement<TriggerProps>;
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

const StyledMenuItem = styled(MuiMenuItem, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant?: Variant }>(({ variant = "sm" }) => {
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
  const actionElement = actions
    ? extendClickable(actions, (e) => {
        e.stopPropagation();
      })
    : null;

  return (
    <StyledMenuItem
      variant={variant}
      className={cn("group relative gap-2.5", className)}
      {...props}
    >
      {children}
      {actionElement && <div className="absolute right-0">{actionElement}</div>}
    </StyledMenuItem>
  );
}
