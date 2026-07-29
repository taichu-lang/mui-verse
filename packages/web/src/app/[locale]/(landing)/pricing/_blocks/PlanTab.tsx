"use client";

import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { PillTabs, useTabContext } from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function PlanTabs({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { updateCheckout } = useCheckout();
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
      className={className}
      onChange={(_, v) => updateCheckout({ duration: v })}
    >
      {children}
    </PillTabs>
  );
}

export function MonthLabel({ variant = "md" }: { variant?: "sm" | "md" }) {
  const t = useTranslations();
  const { value } = useTabContext();
  const active = value === "monthly";

  return (
    <span
      className={cn("leading-4.5", {
        "text-base": variant === "md",
        "text-sm": variant === "sm",
        "text-white": active,
        "text-text-primary": !active,
      })}
    >
      {t("duration.oneMonth")}
    </span>
  );
}

export function YearLabel({ variant = "md" }: { variant?: "sm" | "md" }) {
  const t = useTranslations();
  const { value } = useTabContext();
  const { discountPercent } = useBenefit();
  const { currency } = useCheckout();

  const active = value === "yearly";
  const discount = useMemo(() => {
    return discountPercent(currency);
  }, [discountPercent, currency]);

  return (
    <div
      className={cn(
        "flex gap-2.5",
        active ? "text-white" : "text-text-primary",
      )}
    >
      <span
        className={cn("leading-4.5", {
          "text-sm": variant === "sm",
          "text-base": variant === "md",
        })}
      >
        {t("duration.oneYear")}
      </span>
      <span
        className={cn("leading-4.5 font-medium", {
          "text-white": active,
          "text-primary-500": !active,
          "text-base": variant === "md",
          "text-sm": variant === "sm",
        })}
      >
        {t("pricing.discount", { discount })}
      </span>
    </div>
  );
}
