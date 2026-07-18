"use client";

import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useBenefit } from "@/hooks/useBenefit";
import Link from "next/link";

function BenefitList() {
  const { benefits } = useBenefit();
  if (benefits.length === 0) {
    return null;
  }

  const basic = benefits.find((b) => b.code === "standard_chat");
  const advanced = benefits.find((b) => b.code === "advanced_chat");
  if (!basic || !advanced) {
    return null;
  }

  return (
    <div className="mt-3.5 flex flex-col gap-3 rounded-[18px] bg-[#E6FCF4] px-7.5 py-4.5">
      <div className="flex items-center">
        <CheckIcon />
        <span className="ml-2.5 text-sm">
          Basic models ·
          <span className="font-semibold">{basic.limit} / month</span>
        </span>
      </div>
      <div className="flex items-center">
        <CheckIcon />
        <span className="ml-2.5 text-sm">
          Advanced models ·
          <span className="font-semibold">{advanced.limit} / month</span>
        </span>
      </div>
      <div className="flex items-center">
        <CheckIcon />
        <span className="ml-2.5 text-sm">
          Frontier models (use premium credits)
        </span>
      </div>
      <div className="flex items-center">
        <CheckIcon />
        <span className="ml-2.5 text-sm">Web search</span>
      </div>
    </div>
  );
}

export function UpgradeCard() {
  const { plans } = useBenefit();

  if (plans.length === 0) {
    return null;
  }

  const month = plans
    .find((p) => p.duration === "monthly")
    ?.prices.find((p) => p.currency === "USD");
  const year = plans
    .find((p) => p.duration === "yearly")
    ?.prices.find((p) => p.currency === "USD");
  if (!month || !year) {
    return null;
  }

  const perMonth = year.amount / 12;
  const discount = (((month.amount - perMonth) / month.amount) * 100).toFixed(
    0,
  );

  return (
    <div className="flex w-full flex-col items-center bg-linear-to-b from-[#F2FFFB] to-white px-7.5 pt-4.5 pb-5">
      <p className="text-base">Get {discount}% off the Pro annual plan</p>
      <div className="mt-3 flex items-baseline gap-4.5">
        <p className="text-primary-500">
          <span className="text-2xl font-semibold">${perMonth.toFixed(1)}</span>
          <span className="text-sm">/month</span>
        </p>
        <p className="text-text-secondary text-sm font-semibold">
          ${month.amount}/month
        </p>
      </div>
      <BenefitList />
      <Button
        variant="contained"
        size="small"
        className="mt-3.5 font-semibold"
        fullWidth
      >
        Upgrade now
      </Button>
      <Link href={"/"} className="text-primary-500 mt-3.5 font-semibold">
        View all plans & features
      </Link>
    </div>
  );
}
