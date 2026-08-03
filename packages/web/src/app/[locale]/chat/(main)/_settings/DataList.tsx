import { cn } from "@mui-verse/ui/utils/cn";
import { Divider } from "@mui/material";

export function DataItem({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-8 items-center justify-between", className)}>
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

export function DataSeparator() {
  return <Divider flexItem className="my-2.25" />;
}
