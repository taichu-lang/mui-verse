"use client";

import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { stringifyPrice } from "@/lib/types/currency";
import { PillTab, useTabContext } from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { FreePlanButton, ProPlanButton } from "./Actions";
import { MonthLabel, PlanTabs, YearLabel } from "./PlanTab";

export function FeatureHeader() {
  const t = useTranslations();
  const { value } = useTabContext();
  const { currency } = useCheckout();
  const { monthPrice, yearPrice } = useBenefit();

  const price = useMemo(() => {
    if (value === "monthly") {
      return monthPrice(currency);
    }

    const year = yearPrice(currency);
    if (year) {
      return year / 12;
    }

    return undefined;
  }, [value, monthPrice, yearPrice, currency]);

  return (
    <div
      className={cn(
        "grid w-full grid-cols-4 items-start pt-10 pb-7.5",
        "top-landing-navbar bg-background-gray sticky z-10",
      )}
    >
      <div className="col-span-2 flex flex-col gap-2.5">
        <p className="text-2xl">{t("pricing.plan")}</p>
        <PlanTabs className="mt-2.5 w-fit">
          <PillTab
            value="monthly"
            label={<MonthLabel variant="sm" />}
            className="h-8 px-3"
          />
          <PillTab
            value="yearly"
            label={<YearLabel variant="sm" />}
            className="h-8 px-3"
          />
        </PlanTabs>
      </div>
      <div className="col-span-1 flex flex-col gap-2.5">
        <p className="text-2xl">{t("pricing.free.title")}</p>
        <span className="text-text-secondary text-base">
          {stringifyPrice(0, currency)}/{t("duration.month")}
        </span>
        <FreePlanButton className="w-fit" />
      </div>
      <div className="col-span-1 flex flex-col gap-2.5">
        <p className="text-2xl">{t("pricing.pro.title")}</p>
        <span className="text-text-secondary text-base">
          {stringifyPrice(price || 0, currency)}/{t("duration.month")}
        </span>
        <ProPlanButton className="w-fit" />
      </div>
    </div>
  );
}
