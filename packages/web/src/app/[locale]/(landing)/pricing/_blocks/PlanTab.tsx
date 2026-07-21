"use client";

import { PillTabs, useTabContext } from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";

export function PlanTabs({ children }: { children: React.ReactNode }) {
  return (
    <PillTabs
      variant="standard"
      sx={{
        p: "6px",
        boxShadow:
          "var(--mui-shadow-border), 0px 0px 5px 1px hsla(0, 0%, 64%, 0.25) inset",
      }}
      indicatorSx={{
        bgcolor: "primary.main",
        boxShadow: "0px 0px 4px 0px hsla(0, 0%, 42%, 0.25)",
      }}
      className="my-5"
    >
      {children}
    </PillTabs>
  );
}

export function MonthLabel() {
  const { value } = useTabContext();

  return (
    <span className={value === "monthly" ? "text-white" : "text-text-primary"}>
      One Month
    </span>
  );
}

export function YearLabel() {
  const { value } = useTabContext();
  const active = value === "yearly";

  return (
    <div
      className={cn(
        "flex gap-2.5",
        active ? "text-white" : "text-text-primary",
      )}
    >
      <span className="text-base leading-4.5">One Year</span>
      <span
        className={cn(
          "text-base leading-4.5 font-medium",
          active ? "text-white" : "text-primary-500",
        )}
      >
        Save 20%
      </span>
    </div>
  );
}
