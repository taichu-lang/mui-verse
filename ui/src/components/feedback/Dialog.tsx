"use client";

import { extendClickable, TriggerProps } from "@mui-verse/ui/utils/click";
import {
  Button,
  Divider,
  IconButton,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
} from "@mui/material";
import { XIcon } from "lucide-react";
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

  return (
    <DefaultDialog open={open} onClose={() => setOpen(false)} {...props} />
  );
}

export function DialogTitle({
  children,
  enableCloseTrigger = false,
  useSeparator = true,
}: {
  children: React.ReactNode;
  enableCloseTrigger?:
    boolean | React.ReactElement<TriggerProps & { children?: React.ReactNode }>;
  useSeparator?: boolean;
}) {
  const { setOpen } = useDialogContext();

  let trigger = null;
  if (enableCloseTrigger) {
    if (typeof enableCloseTrigger !== "boolean") {
      trigger = cloneElement(enableCloseTrigger, {
        onClick: () => setOpen(false),
        children: <XIcon className="h-3 w-3" />,
      });
    } else {
      trigger = (
        <IconButton onClick={() => setOpen(false)}>
          <XIcon className="h-3 w-3" />
        </IconButton>
      );
    }
  }

  return (
    <MuiDialogTitle className="flex flex-col gap-2">
      <div className="font-subtitle1 flex items-center justify-between">
        {children}
        {enableCloseTrigger && trigger}
      </div>
      {useSeparator && <Divider flexItem variant="fullWidth" />}
    </MuiDialogTitle>
  );
}

export function DialogTrigger({
  children,
}: {
  children: React.ReactElement<TriggerProps>;
}) {
  const { setOpen } = useDialogContext();
  const trigger = extendClickable(children, () => setOpen(true));

  return trigger;
}

export function DialogActions({
  fullWidth = true,
  cancel,
  submit,
  onSubmit,
}: {
  fullWidth?: boolean;
  cancel?: string;
  submit: string;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
            className="rounded-lg py-1.75"
            onClick={handleCancel}
          >
            {cancel}
          </Button>
        )}
        <Button onClick={handleSubmit} className="rounded-lg py-1.75">
          {submit}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-6 mb-2 flex items-center justify-end gap-2">
      {cancel && (
        <Button variant="outlined" className="py-1.75" onClick={handleCancel}>
          {cancel}
        </Button>
      )}
      <Button onClick={handleSubmit} className="py-1.75">
        {submit}
      </Button>
    </div>
  );
}
