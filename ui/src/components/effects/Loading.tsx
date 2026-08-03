import { cn } from "@mui-verse/ui/utils/cn";
import { CircularProgress } from "@mui/material";
import { LoaderIcon } from "lucide-react";

export function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <CircularProgress size={20} />
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderIcon
      strokeWidth={2.5}
      className={cn("min-w-0 shrink-0", className)}
    />
  );
}

export function AnimatedSpinner() {
  return <Spinner className="animate-spin" />;
}
