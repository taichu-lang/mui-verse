"use client";

import {
  Divider,
  Menu,
  MenuItem,
  type MenuItemProps,
  type MenuProps,
} from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

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

function useDropdownMenu() {
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
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { onOpen } = useDropdownMenu();

  return (
    <div
      style={{ display: "inline-flex" }}
      onClick={(e) => {
        onOpen(e.currentTarget);
      }}
    >
      {children}
    </div>
  );
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

export interface DropdownMenuContentProps extends Omit<
  MenuProps,
  "open" | "anchorEl" | "onClose"
> {
  children: React.ReactNode;
}

export function DropdownMenuContent({
  children,
  sx,
  ...menuProps
}: DropdownMenuContentProps) {
  const { open, anchorEl, onClose, side, align } = useDropdownMenu();

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOriginMap[side][align]}
      transformOrigin={transformOriginMap[side][align]}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            minWidth: 160,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "divider",
            boxShadow:
              "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
            py: 0.5,
            ...sx,
          },
        },
      }}
      {...menuProps}
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
  sx,
  ...props
}: DropdownMenuItemProps) {
  const { onClose } = useDropdownMenu();

  return (
    <MenuItem
      onClick={(e) => {
        onClick?.(e);
        if (closeOnClick) onClose();
      }}
      sx={{
        fontSize: "0.875rem",
        lineHeight: 1,
        borderRadius: "4px",
        mx: 0.5,
        px: 1.5,
        py: 0.75,
        minHeight: "unset",
        display: "flex",
        alignItems: "center",
        gap: 1,
        "&:hover": {
          backgroundColor: "action.hover",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

// --- Separator ---

export function DropdownMenuSeparator() {
  return <Divider sx={{ my: 0.5 }} />;
}
