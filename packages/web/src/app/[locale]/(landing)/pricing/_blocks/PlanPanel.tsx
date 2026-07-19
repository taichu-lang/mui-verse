"use client";

import {
  CheckIcon,
  FreeTierIcon,
  ProTierIcon,
  SparkleFilledIcon,
} from "@/components/icons";
import { CheckXIcon } from "@/components/icons/Check";
import { Button } from "@/components/ui/Button";
import { useBenefit } from "@/hooks/useBenefit";
import { useTabContext } from "@mui-verse/ui/components/navigation";
import { cn } from "@mui-verse/ui/utils/cn";
import { useMemo } from "react";

function Header({
  Icon,
  title,
  price,
  description,
}: {
  Icon: React.ElementType;
  title: string;
  price?: string;
  description: string;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Icon />
        <span className="text-xl leading-6 font-medium">{title}</span>
      </div>
      <div className="mt-4.5 flex items-baseline gap-1">
        <span className="text-[32px] leading-9.5 font-medium">${price}</span>
        <span className="text-text-secondary text-sm">USD/mo</span>
      </div>
      <p className="text-text-secondary mt-2.5 text-sm">{description}</p>
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
  return (
    <div className="flex w-99 flex-col rounded-[20px] bg-white px-6.5 pt-5 pb-7.5 shadow-[--mui-shadow-border]">
      <Header
        Icon={FreeTierIcon}
        title="Free"
        price={"0"}
        description="Perfect for getting started"
      />
      <Button
        size="small"
        fullWidth
        variant="outlined"
        className="mt-3.5 font-medium"
      >
        Get started
      </Button>
      <div className="mt-7.5 flex flex-col gap-3.25">
        <Feature
          Icon={CheckIcon}
          feature={
            <>
              Basic models · <span className="font-semibold">40 / day</span>
            </>
          }
        />
        <Feature Icon={CheckIcon} feature="Text conversations" />
        <Feature Icon={CheckIcon} feature="Multi-turn dialogue" />
        <Feature Icon={CheckIcon} feature="Chat history saved" />
        <Feature Icon={CheckIcon} feature="Standard context window" />
        <Feature Icon={CheckXIcon} feature="Advanced models" disabled />
        <Feature Icon={CheckXIcon} feature="Frontier models" disabled />
        <Feature Icon={CheckXIcon} feature="Web search" disabled />
      </div>
    </div>
  );
}

export function ProPanel() {
  const { value } = useTabContext();
  const { monthPrice, yearPrice } = useBenefit();

  const price = useMemo(() => {
    if (value === "monthly") {
      return monthPrice("USD")?.toFixed(1);
    }

    const year = yearPrice("USD");
    if (year) {
      return (year / 12).toFixed(1);
    }

    return undefined;
  }, [value, monthPrice, yearPrice]);

  return (
    <div className="flex w-99 flex-col rounded-[20px] bg-linear-to-b from-[#F2FFFB] to-white px-6.5 pt-5 pb-7.5 shadow-[--mui-shadow-border]">
      <Header
        Icon={ProTierIcon}
        title="Pro"
        price={price}
        description="For power users"
      />
      <Button
        size="small"
        fullWidth
        className="from-primary-500 mt-3.5 bg-linear-to-r to-[#27B2E5]"
      >
        Upgrade to Pro
      </Button>
      <div className="mt-7.5 flex flex-col gap-3.25">
        <Feature
          Icon={CheckIcon}
          feature={
            <>
              Basic models · <span className="font-semibold">3000 / month</span>
            </>
          }
        />
        <Feature
          Icon={CheckIcon}
          feature={
            <>
              Advanced models ·{" "}
              <span className="font-semibold">200 / month</span>
            </>
          }
        />
        <Feature
          Icon={CheckIcon}
          feature="Frontier models (use premium credits)"
        />
        <Feature Icon={CheckIcon} feature="Web search" />
        <Feature Icon={CheckIcon} feature="Extended context window" />
        <Feature
          Icon={() => (
            <SparkleFilledIcon className="text-primary-500 h-3 w-3" />
          )}
          feature={
            <>
              <span className="font-semibold">800 premium credits</span> / month
            </>
          }
        />
      </div>
    </div>
  );
}

export function PlanPanels() {
  return (
    <div className="mt-5 flex gap-6">
      <FreePanel />
      <ProPanel />
    </div>
  );
}
