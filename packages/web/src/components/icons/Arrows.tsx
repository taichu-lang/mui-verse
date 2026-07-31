import { cn } from "@mui-verse/ui/utils/cn";
import { ArrowRight, ChevronRight } from "lucide-react";

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn("min-w-0 shrink-0", className)}
      strokeWidth={1.2}
    />
  );
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <ChevronRight
      className={cn("min-w-0 shrink-0", className)}
      strokeWidth={1.2}
    />
  );
}

export function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("min-w-0 shrink-0", className)}
    >
      <path
        d="M18.75 22.5L11.25 15L18.75 7.5"
        stroke="#232323"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
