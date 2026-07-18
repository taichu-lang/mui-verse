import { cn } from "@mui-verse/ui/utils/cn";

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("min-w-0 shrink-0", className)}
    >
      <path
        d="M6.75 13.5L11.25 9L6.75 4.5"
        stroke="#232323"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
