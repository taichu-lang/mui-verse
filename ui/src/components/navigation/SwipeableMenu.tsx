"use client";

import { useTheme } from "@mui-verse/ui/theme";
import { cn } from "@mui-verse/ui/utils/cn";
import { MenuItem, MenuItemProps, SwipeableDrawer } from "@mui/material";
import { createContext, useCallback, useContext, useState } from "react";

type Side = "top" | "right" | "bottom" | "left";

interface SwipeableMenuContextValue {
  open: boolean;
  side: Side;
  onOpen: () => void;
  onClose: () => void;
  close: () => void;
}

const SwipeableMenuContext = createContext<SwipeableMenuContextValue | null>(
  null,
);

export function useSwipeableMenu() {
  const ctx = useContext(SwipeableMenuContext);
  if (!ctx) {
    throw new Error(
      "SwipeableMenu compound components must be used within <SwipeableMenu>",
    );
  }

  return ctx;
}

export function SwipeableMenu({
  defaultOpen = false,
  side = "bottom",
  onClose,
  children,
}: {
  defaultOpen?: boolean;
  side?: Side;
  onClose?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const onOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <SwipeableMenuContext.Provider
      value={{
        open,
        side,
        onOpen,
        onClose: handleClose,
        close,
      }}
    >
      {children}
    </SwipeableMenuContext.Provider>
  );
}

// --- Content ---
export function SwipeableMenuContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, side, onOpen, onClose } = useSwipeableMenu();
  const { isDark } = useTheme();

  return (
    <SwipeableDrawer
      anchor={side}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      slotProps={{
        paper: {
          sx: {
            border: "none",
            borderRadius: "16px 16px 0 0",
            backgroundColor: isDark
              ? "rgba(13, 16, 19, 0.6)"
              : "rgba(255, 255, 255, 0.6)", // background.paper
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          },
        },
        backdrop: {
          invisible: true,
        },
      }}
    >
      <div className={cn("flex flex-col gap-2 p-2", className)}>{children}</div>
    </SwipeableDrawer>
  );
}

// --- Trigger ---

export interface SwipeableMenuTriggerProps {
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
}

export function SwipeableMenuTrigger({ children }: SwipeableMenuTriggerProps) {
  const { onOpen } = useSwipeableMenu();

  return (
    <div
      style={{ display: "inline-flex" }}
      onClick={() => {
        onOpen();
      }}
    >
      {children}
    </div>
  );
}

// --- Item ---

export interface SwipeableMenuItemProps extends MenuItemProps {
  closeOnClick?: boolean;
}

export function SwipeableMenuItem({
  closeOnClick = true,
  onClick,
  sx,
  ...props
}: SwipeableMenuItemProps) {
  const { onClose } = useSwipeableMenu();

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

export function SwipeableIndicator() {
  return (
    <div className="mb-2 flex w-full items-center justify-center">
      <div className="h-1.25 w-10 rounded-xl bg-gray-300"></div>
    </div>
  );
}
