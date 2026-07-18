import { cn } from "@mui-verse/ui/utils/cn";

export function GlobeCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("min-w-0 shrink-0", className)}
    >
      <g clipPath="url(#clip0_1676_14521)">
        <path
          d="M11.25 4.5L12.75 6L15.75 3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.5 9H16.5C16.5 10.4834 16.0601 11.9334 15.236 13.1668C14.4119 14.4001 13.2406 15.3614 11.8701 15.9291C10.4997 16.4968 8.99168 16.6453 7.53683 16.3559C6.08197 16.0665 4.7456 15.3522 3.6967 14.3033C2.64781 13.2544 1.9335 11.918 1.64411 10.4632C1.35472 9.00832 1.50325 7.50032 2.07091 6.12987C2.63856 4.75943 3.59986 3.58809 4.83323 2.76398C6.0666 1.93987 7.51664 1.5 9 1.5C7.07418 3.52212 6 6.20756 6 9C6 11.7924 7.07418 14.4779 9 16.5C10.9258 14.4779 12 11.7924 12 9"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1676_14521">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
