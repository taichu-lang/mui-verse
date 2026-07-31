import { cn } from "@mui-verse/ui/utils/cn";
import { ShieldAlert } from "lucide-react";

export function ShieldAlertIcon({ className }: { className?: string }) {
  return <ShieldAlert className={cn("min-w-0 shrink-0", className)} />;
}
