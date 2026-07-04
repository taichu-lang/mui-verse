"use client";

import {
  DefaultDialog,
  DialogProps,
  Dialog as MuiDialog,
} from "@mui-verse/ui/components/feedback";
import { useRouter } from "next/navigation";

export function Dialog({ maxWidth = "sm", ...props }: DialogProps) {
  return (
    <MuiDialog
      maxWidth={maxWidth}
      {...props}
      sx={{
        boxShadow: "none",
      }}
    />
  );
}

export function InterceptingDialog(props: DialogProps) {
  const router = useRouter();

  return (
    <DefaultDialog
      open={true}
      onClose={() => router.back()}
      {...props}
    ></DefaultDialog>
  );
}
