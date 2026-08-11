import { Button } from "@mui/material";
import { CheckIcon } from "lucide-react";

export function SuccessPage({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-4 flex w-md flex-col items-center gap-10 sm:mx-0">
        <CheckIcon className="h-6 w-6" />
        <p className="mt-1.5 text-2xl">Payment successful</p>
        <p className="text-base">
          Your order is confirmed. Let&apos;s get started.
        </p>
        <Button className="mt-16 px-2.5 py-2 text-sm" onClick={onClick}>
          Get started
        </Button>
      </div>
    </div>
  );
}
