"use client";

import { CloseXIcon } from "@mui-verse/ui/components/icons";
import { extendClickable, TriggerProps } from "@mui-verse/ui/utils/click";
import { cn } from "@mui-verse/ui/utils/cn";
import {
  Button,
  IconButton,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
} from "@mui/material";
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface DialogValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogValue | null>(null);

export function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialogContext must be used within a Dialog component");
  }

  return ctx;
}

export function DialogProvider({
  children,
  defaultOpen = false,
  onClose,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const handleOpen = useCallback(
    (_open: boolean) => {
      setOpen(_open);
      if (!_open) {
        onClose?.();
      }
    },
    [onClose],
  );

  return (
    <DialogContext.Provider value={{ open, setOpen: handleOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export type DialogProps = Omit<MuiDialogProps, "open" | "onClose">;

export function DefaultDialog({
  fullWidth = true,
  maxWidth = "xs",
  sx,
  ...props
}: MuiDialogProps) {
  return (
    <MuiDialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            margin: 0,
            borderRadius: "18px",
            ...sx,
          },
        },
      }}
      {...props}
    />
  );
}

export function Dialog(props: DialogProps) {
  const { open, setOpen } = useDialogContext();

  const handleClose = () => {
    setOpen(false);
  };

  return <DefaultDialog open={open} onClose={handleClose} {...props} />;
}

export function DialogTitle({
  children,
  enableCloseTrigger = false,
  useSeparator = true,
  className,
}: {
  children: React.ReactNode;
  enableCloseTrigger?: boolean | React.ReactElement<TriggerProps>;
  useSeparator?: boolean;
  className?: string;
}) {
  const { setOpen } = useDialogContext();

  let trigger = null;
  if (enableCloseTrigger) {
    if (typeof enableCloseTrigger !== "boolean") {
      trigger = cloneElement(enableCloseTrigger, {
        onClick: () => setOpen(false),
      });
    } else {
      trigger = (
        <IconButton onClick={() => setOpen(false)}>
          <CloseXIcon className="h-4 w-4" />
        </IconButton>
      );
    }
  }

  return (
    <MuiDialogTitle
      className={cn(
        "flex items-center justify-between",
        {
          "shadow-(--mui-shadow-border-y)": useSeparator,
        },
        className,
      )}
    >
      {children}
      {enableCloseTrigger && trigger}
    </MuiDialogTitle>
  );
}

export function DialogTrigger({
  children,
}: {
  children: React.ReactElement<TriggerProps>;
}) {
  const { setOpen } = useDialogContext();
  const trigger = extendClickable(children, (e) => {
    setOpen(true);
    e.preventDefault();
  });

  return trigger;
}

export function DialogActions({
  fullWidth = true,
  cancel,
  submit,
  onSubmit,
  variant = "primary",
}: {
  fullWidth?: boolean;
  cancel?: string;
  submit: string;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "error";
}) {
  const { setOpen } = useDialogContext();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    onSubmit(e);
    if (e.isDefaultPrevented()) {
      return;
    }

    setOpen(false);
  };

  if (fullWidth) {
    return (
      // mx-6: same as DialogTitle.
      <div className="mx-6 mb-2 grid grid-cols-2 gap-2">
        {cancel && (
          <Button
            variant="outlined"
            className="text-text-primary rounded-lg py-1.75"
            onClick={handleCancel}
          >
            {cancel}
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          className="rounded-lg py-1.75"
          color={variant}
        >
          {submit}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-6 mb-2 flex items-center justify-end gap-2">
      {cancel && (
        <Button
          variant="outlined"
          className="text-text-primary py-1.75"
          onClick={handleCancel}
        >
          {cancel}
        </Button>
      )}
      <Button onClick={handleSubmit} className="py-1.75" color={variant}>
        {submit}
      </Button>
    </div>
  );
}
