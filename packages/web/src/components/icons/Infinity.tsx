import { cn } from "@mui-verse/ui/utils/cn";

export function InfinityIcon({ className }: { className?: string }) {
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
        d="M4.5 12C8.25 12 9.75 6 13.5 6C14.2956 6 15.0587 6.31607 15.6213 6.87868C16.1839 7.44129 16.5 8.20435 16.5 9C16.5 9.79565 16.1839 10.5587 15.6213 11.1213C15.0587 11.6839 14.2956 12 13.5 12C9.75 12 8.25 6 4.5 6C3.70435 6 2.94129 6.31607 2.37868 6.87868C1.81607 7.44129 1.5 8.20435 1.5 9C1.5 9.79565 1.81607 10.5587 2.37868 11.1213C2.94129 11.6839 3.70435 12 4.5 12Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
