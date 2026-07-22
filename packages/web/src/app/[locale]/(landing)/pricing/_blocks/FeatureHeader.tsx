"use client";

import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { PillTab, useTabContext } from "@mui-verse/ui/components/navigation";
import { useMemo } from "react";
import { FreePlanButton, ProPlanButton } from "./Actions";
import { MonthLabel, PlanTabs, YearLabel } from "./PlanTab";

export function FeatureHeader() {
  const { value } = useTabContext();
  const { currency } = useCheckout();
  const { monthPrice, yearPrice } = useBenefit();

  const price = useMemo(() => {
    if (value === "monthly") {
      return monthPrice(currency)?.toFixed(1);
    }

    const year = yearPrice(currency);
    if (year) {
      return (year / 12).toFixed(1);
    }

    return undefined;
  }, [value, monthPrice, yearPrice, currency]);

  return (
    <div className="mt-10 grid w-full grid-cols-4 items-start">
      <div className="col-span-2 flex flex-col gap-2.5">
        <p className="text-2xl">Plan</p>
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
        <p className="text-2xl">Free</p>
        <span className="text-text-secondary text-base">{currency} 0/mo</span>
        <FreePlanButton className="w-fit" />
      </div>
      <div className="col-span-1 flex flex-col gap-2.5">
        <p className="text-2xl">Pro</p>
        <span className="text-text-secondary text-base">
          {currency} {price}/mo
        </span>
        <ProPlanButton className="w-fit" />
      </div>
    </div>
  );
}
