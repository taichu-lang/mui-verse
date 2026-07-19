import { cn } from "@mui-verse/ui/utils/cn";

export function FreeTierIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="17"
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("min-w-0 shrink-0", className)}
    >
      <path d="M7.5 0L15 8.5L7.5 17L0 8.5L7.5 0Z" fill="#E2E2E2" />
    </svg>
  );
}

export function ProTierIcon({ className }: { className?: string }) {
  return (
    <svg
      width="15"
      height="17"
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("min-w-0 shrink-0", className)}
    >
      <path d="M7.5 0L15 8.49975H0L7.5 0Z" fill="#6FC1FF" />
      <path d="M0 8.5H15L7.5 16.9997L0 8.5Z" fill="#3AAAFF" />
    </svg>
  );
}
