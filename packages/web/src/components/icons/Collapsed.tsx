import { cn } from "@mui-verse/ui/utils/cn";

export function CollapsedIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("min-w-0 shrink-0", className)}
    >
      <path
        d="M14.9722 0.75H2.52778C1.54594 0.75 0.75 1.44645 0.75 2.30556V13.1944C0.75 14.0536 1.54594 14.75 2.52778 14.75H14.9722C15.9541 14.75 16.75 14.0536 16.75 13.1944V2.30556C16.75 1.44645 15.9541 0.75 14.9722 0.75Z"
        stroke="#767676"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.418 0.75V14.75"
        stroke="#767676"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
