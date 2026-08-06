"use client";

import {
  CheckIcon,
  FreeTierIcon,
  ProTierIcon,
  XIcon,
} from "@/components/icons";
import { CurrencySwitch } from "@/components/ui/CurrencySwitch";
import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { stringifyPriceSymbol } from "@/lib/types/currency";
import { PlanCode } from "@/lib/types/enums";
import { useTabContext } from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { FreePlanButton, ProPlanButton } from "./Actions";

function Header({ plan, price }: { plan: PlanCode; price: number }) {
  const Icon = plan === "free" ? FreeTierIcon : ProTierIcon;
  const t = useTranslations();
  const { currency } = useCheckout();

  return (
    <>
      <div className="flex items-center gap-2">
        <Icon />
        <span className="text-xl leading-6 font-medium">
          {t(`pricing.${plan}.title`)}
        </span>
        <div className="flex-1" />
        <div
          className={cn(
            "pointer-events-none invisible",
            plan === "pro" && "pointer-events-auto visible",
          )}
        >
          <CurrencySwitch />
        </div>
      </div>
      <div className="mt-4.5 flex items-baseline gap-1">
        <span className="text-[32px] leading-9.5 font-medium">
          {stringifyPriceSymbol(price, currency)}
        </span>
        <span className="text-text-secondary text-sm">
          /{t("duration.month")}
        </span>
      </div>
      <p className="text-text-secondary mt-2.5 text-sm">
        {t(`pricing.${plan}.description`)}
      </p>
    </>
  );
}

function Feature({
  Icon,
  feature,
  disabled = false,
}: {
  Icon: React.ElementType;
  feature: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon />
      <p className={cn("text-sm", disabled && "text-text-secondary ml-0.75")}>
        {feature}
      </p>
    </div>
  );
}

export function FreePanel() {
  const t = useTranslations();
  const { basicQuota } = useBenefit();
  const CheckedIcon = () => <CheckIcon className="text-primary-500" />;
  const UncheckedIcon = () => <XIcon className="text-text-secondary" />;

  const { quota } = basicQuota("free");

  return (
    <div className="flex w-full flex-col rounded-[20px] bg-white px-6.5 pt-5 pb-7.5 shadow-[--mui-shadow-border]">
      <Header plan="free" price={0} />
      <FreePlanButton className="mt-3.5 font-medium" />
      <div className="mt-7.5 flex flex-col gap-3.25">
        <Feature
          Icon={CheckedIcon}
          feature={
            <>
              {t("pricing.benefits.basic")}
              {" · "}
              <span className="font-semibold">{quota}</span>
            </>
          }
        />
        <Feature Icon={CheckedIcon} feature={t("pricing.benefits.text")} />
        <Feature Icon={CheckedIcon} feature={t("pricing.benefits.multiTurn")} />
        <Feature Icon={CheckedIcon} feature={t("pricing.benefits.history")} />
        <Feature
          Icon={CheckedIcon}
          feature={t("pricing.benefits.standardContext")}
        />
        <Feature
          Icon={UncheckedIcon}
          feature={t("pricing.benefits.advanced")}
          disabled
        />
        <Feature
          Icon={UncheckedIcon}
          feature={t("pricing.benefits.frontier")}
          disabled
        />
        <Feature
          Icon={UncheckedIcon}
          feature={t("pricing.benefits.search")}
          disabled
        />
      </div>
    </div>
  );
}

export function ProPanel() {
  const t = useTranslations();
  const { value } = useTabContext();
  const { monthPrice, yearPrice, basicQuota, advancedQuota, frontierQuota } =
    useBenefit();
  const { currency } = useCheckout();
  const CheckedIcon = () => <CheckIcon className="text-primary-500" />;

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

  const { quota: q1 } = basicQuota("pro");
  const { quota: q2 } = advancedQuota();
  const { quota: q3 } = frontierQuota();

  return (
    <div className="flex w-full flex-col rounded-[20px] bg-linear-to-b from-[#F2FFFB] to-white px-6.5 pt-5 pb-7.5 shadow-[--mui-shadow-border]">
      <Header plan="pro" price={price || 0} />
      <ProPlanButton className="mt-3.5" />
      <div className="mt-7.5 flex flex-col gap-3.25">
        <Feature
          Icon={CheckedIcon}
          feature={
            <>
              {t("pricing.benefits.basic")}
              {" · "}
              <span className="font-semibold">{q1}</span>
            </>
          }
        />
        <Feature
          Icon={CheckedIcon}
          feature={
            <>
              {t("pricing.benefits.advanced")}
              {" · "}
              <span className="font-semibold">{q2}</span>
            </>
          }
        />
        <Feature
          Icon={CheckedIcon}
          feature={<span className="font-semibold">{q3}</span>}
        />
        <Feature Icon={CheckedIcon} feature={t("pricing.benefits.search")} />
        <Feature
          Icon={CheckedIcon}
          feature={t("pricing.benefits.extendedContext")}
        />
      </div>
    </div>
  );
}

export function PlanPanels() {
  return (
    <div className="mt-5 grid w-full grid-cols-2 gap-8.5">
      <FreePanel />
      <ProPanel />
    </div>
  );
}
