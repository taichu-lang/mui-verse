import { cn } from "@mui-verse/ui/utils/cn";

export function Chip({
  label,
  icon,
  gray = false,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  gray?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-full px-5 py-2.5",
        {
          "bg-[#ECECEC]": gray,
          "bg-[#F5F5F5]": !gray,
          "flex items-center gap-2": icon,
        },
        className,
      )}
    >
      {icon}
      <p className="text-sm">{label}</p>
    </div>
  );
}
