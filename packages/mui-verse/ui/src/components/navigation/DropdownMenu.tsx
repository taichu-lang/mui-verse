"use client";

import { extendClickable, TriggerProps } from "@mui-verse/ui/utils/click";
import { Divider, Menu, type MenuProps } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";
import { MenuItem, MenuItemProps } from "./MenuItem";

type Align = "start" | "center" | "end";
type Side = "top" | "right" | "bottom" | "left";

interface DropdownMenuContextValue {
  open: boolean;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  onOpen: (el: HTMLElement) => void;
  onClose: () => void;
  side: Side;
  align: Align;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(
  null,
);

export function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) {
    throw new Error(
      "DropdownMenu compound components must be used within <DropdownMenu>",
    );
  }

  return ctx;
}

// --- Root ---

export interface DropdownMenuProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * The preferred side of the trigger to render the menu when open. Default is 'bottom'.
   */
  side?: Side;

  /**
   * The preferred alignment of the menu when open. Default is 'center'.
   */
  align?: Align;

  children: React.ReactNode;
}

export function DropdownMenu({
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "center",
  children,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onOpen = useCallback(
    (el: HTMLElement) => {
      setAnchorEl(el);
      setOpen(true);
      onOpenChange?.(true);
    },
    [onOpenChange],
  );

  const onClose = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <DropdownMenuContext.Provider
      value={{ open, anchorEl, setAnchorEl, onOpen, onClose, side, align }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

// --- Trigger ---

export interface DropdownMenuTriggerProps {
  children: React.ReactElement<TriggerProps>;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { onOpen } = useDropdownMenu();

  const trigger = extendClickable(children, (e) => {
    e.stopPropagation();
    onOpen(e.currentTarget);
  });

  return trigger;
}

// --- Content ---

const anchorOriginMap: Record<
  Side,
  Record<Align, MenuProps["anchorOrigin"]>
> = {
  bottom: {
    start: { vertical: "bottom", horizontal: "left" },
    center: { vertical: "bottom", horizontal: "center" },
    end: { vertical: "bottom", horizontal: "right" },
  },
  top: {
    start: { vertical: "top", horizontal: "left" },
    center: { vertical: "top", horizontal: "center" },
    end: { vertical: "top", horizontal: "right" },
  },
  left: {
    start: { vertical: "top", horizontal: "left" },
    center: { vertical: "center", horizontal: "left" },
    end: { vertical: "bottom", horizontal: "left" },
  },
  right: {
    start: { vertical: "top", horizontal: "right" },
    center: { vertical: "center", horizontal: "right" },
    end: { vertical: "bottom", horizontal: "right" },
  },
};

const transformOriginMap: Record<
  Side,
  Record<Align, MenuProps["transformOrigin"]>
> = {
  bottom: {
    start: { vertical: "top", horizontal: "left" },
    center: { vertical: "top", horizontal: "center" },
    end: { vertical: "top", horizontal: "right" },
  },
  top: {
    start: { vertical: "bottom", horizontal: "left" },
    center: { vertical: "bottom", horizontal: "center" },
    end: { vertical: "bottom", horizontal: "right" },
  },
  left: {
    start: { vertical: "top", horizontal: "right" },
    center: { vertical: "center", horizontal: "right" },
    end: { vertical: "bottom", horizontal: "right" },
  },
  right: {
    start: { vertical: "top", horizontal: "left" },
    center: { vertical: "center", horizontal: "left" },
    end: { vertical: "bottom", horizontal: "left" },
  },
};

type ShadowLevel = "none" | "xs" | "sm" | "md" | "lg";

export interface DropdownMenuContentProps extends Omit<
  MenuProps,
  "open" | "anchorEl" | "onClose"
> {
  children: React.ReactNode;
  shadow?: ShadowLevel;
}

export function DropdownMenuContent({
  children,
  shadow = "lg",
  sx,
  ...props
}: DropdownMenuContentProps) {
  const { open, anchorEl, onClose, side, align } = useDropdownMenu();
  const shadows: Record<ShadowLevel, string> = {
    none: "none",
    xs: "var(--mui-shadow-surface-xs)",
    sm: "var(--mui-shadow-surface-sm)",
    md: "var(--mui-shadow-surface-md)",
    lg: "var(--mui-shadow-surface-lg)",
  };

  return (
    <Menu
      // If autoFocus is true, the first item will be focused once the menu is
      // opened. It might be confused if the background color of selected item
      // is same as `hover` action.
      autoFocus={false}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOriginMap[side][align]}
      transformOrigin={transformOriginMap[side][align]}
      // MUI Popover keeps the menu at least `marginThreshold` px (default 16)
      // from every viewport edge, nudging it inward when the computed position
      // is closer than that. For triggers near the edge (e.g. inside a sidebar
      // flush with the viewport), this offsets the menu from the trigger and
      // breaks left/right alignment. Disable the safeguard so the menu sits
      // exactly where `anchorOrigin` / `transformOrigin` ask.
      marginThreshold={0}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            minWidth: 160,
            borderRadius: "18px",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: shadows[shadow],
            py: "8px",
            px: "8px",
            ...sx,
          },
        },
      }}
      {...props}
    >
      {children}
    </Menu>
  );
}

// --- Item ---

export interface DropdownMenuItemProps extends MenuItemProps {
  closeOnClick?: boolean;
}

export function DropdownMenuItem({
  closeOnClick = true,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { onClose } = useDropdownMenu();

  return (
    <MenuItem
      onClick={(e) => {
        onClick?.(e);
        if (closeOnClick) onClose();
      }}
      {...props}
    />
  );
}

// --- Separator ---

export function DropdownMenuSeparator() {
  return <Divider flexItem />;
}
