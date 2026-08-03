"use client";

import { extendHover, HoverProps } from "@mui-verse/ui/utils/click";
import {
  Popover as MuiPopover,
  PopoverProps as MuiPopoverProps,
} from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Align,
  AnchorOriginMap,
  Side,
  TransformOriginMap,
} from "./DropdownMenu";

interface PopoverContextValue {
  open: boolean;
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  onOpen: (el: HTMLElement) => void;
  onClose: () => void;
  cancelClose: () => void;
  side: Side;
  align: Align;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error(
      "Popover compound components must be used within <Popover>",
    );
  }

  return ctx;
}

// --- Root ---

export interface PopoverProps {
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

export function Popover({
  side = "bottom",
  align = "center",
  closeDelay = 150,
  children,
}: {
  side?: Side;
  align?: Align;
  closeDelay?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const onOpen = useCallback(
    (el: HTMLElement) => {
      cancelClose();
      setAnchorEl(el);
      setOpen(true);
    },
    [cancelClose],
  );

  const onClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setAnchorEl(null);
      setOpen(false);
      closeTimerRef.current = null;
    }, closeDelay);
  }, [cancelClose, closeDelay]);

  useEffect(() => cancelClose, [cancelClose]);

  return (
    <PopoverContext.Provider
      value={{
        open,
        anchorEl,
        setAnchorEl,
        onOpen,
        onClose,
        cancelClose,
        side,
        align,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverContentProps extends Omit<
  MuiPopoverProps,
  "open" | "anchorEl" | "onClose"
> {
  children: React.ReactNode;
}

// Use a negative margin in the same direction as the side to set the spacing
// between the trigger and the content. For example, if side is top, set
// `mt: '-10px'`.
export function PopoverContent({
  children,
  sx,
  ...props
}: PopoverContentProps) {
  const { open, anchorEl, onClose, cancelClose, side, align } = usePopover();

  return (
    <MuiPopover
      {...props}
      sx={{ pointerEvents: "none" }} // Important, otherwise the popover blocks hover on the trigger below.
      slotProps={{
        paper: {
          elevation: 0,
          onMouseEnter: cancelClose,
          onMouseLeave: onClose,
          sx: {
            pointerEvents: "auto",
            minWidth: 160,
            borderRadius: "18px",
            border: 0,
            borderColor: "divider",
            boxShadow: "var(--mui-shadow-border)",
            py: "8px",
            px: "8px",
            ...sx,
          },
        },
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={AnchorOriginMap[side][align]}
      transformOrigin={TransformOriginMap[side][align]}
      onClose={onClose}
      disableRestoreFocus
    >
      {children}
    </MuiPopover>
  );
}

export function PopoverTrigger({
  children,
}: {
  children: React.ReactElement<HoverProps>;
}) {
  const { onOpen, onClose } = usePopover();
  return extendHover(
    children,
    (e) => onOpen(e.currentTarget),
    () => onClose(),
  );
}
