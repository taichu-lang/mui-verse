"use client";

import {
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
  styled,
} from "@mui/material";

type Variant = "sm" | "md";

interface MenuItemProps extends MuiMenuItemProps {
  variant?: Variant;
}

type Preset = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  radius: string;
  padding: string;
  margin: string;
};

const StyledMenuItem = styled(MuiMenuItem, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant?: Variant }>(({ variant = "sm" }) => {
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
  const preset = presets[variant];

  return {
    fontSize: `var(--mv-menu-font-size, ${preset["fontSize"]})`,
    lineHeight: `var(--mv-menu-line-height, ${preset["lineHeight"]})`,
    fontWeight: `var(--mv-menu-font-weight, ${preset["fontWeight"]})`,
    borderRadius: `var(--mv-menu-radius, ${preset["radius"]})`,
    padding: `var(--mv-menu-padding, ${preset["padding"]})`,
    margin: `var(--mv-menu-margin, ${preset["margin"]})`,
    minHeight: "unset",
    display: "flex",
    alignItems: "center",
    letterSpacing: 0,
    height: "unset",
  };
});

export function MenuItem({ variant = "sm", ...rest }: MenuItemProps) {
  return <StyledMenuItem variant={variant} {...rest} />;
}
