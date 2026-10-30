import { cn } from "@mui-verse/ui/utils/cn";

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("min-w-0 shrink-0", className)}
    >
      <path
        d="M0.599976 0.601563L6.59998 6.60156L0.599975 12.6016"
        stroke="#767676"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
