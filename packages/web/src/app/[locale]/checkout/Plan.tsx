"use client";

import {
  GlobeCheckIcon,
  InfinityIcon,
  SparkleIcon,
  SparklesIcon,
} from "@/components/icons";
import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { Divider } from "@mui/material";

function Feature({
  Icon,
  children,
}: {
  Icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="text-primary-500" />
      <p className="text-sm">{children}</p>
    </div>
  );
}

export default function PlanSide() {
  const { duration, order_id, period_start, period_end } = useCheckout();
  const { benefits } = useBenefit();
  const basic = benefits.find((b) => b.code === "standard_chat");
  const advanced = benefits.find((b) => b.code === "advanced_chat");
  if (!basic || !advanced) {
    return null;
  }

  return (
    <div className="checkout-plan flex w-full flex-col rounded-[40px] px-7 py-6.5">
      <p className="text-2xl">Pro plan</p>
      <p className="mt-6 text-base">Top features</p>
      <div className="mt-5 flex flex-col gap-3.5">
        <Feature Icon={InfinityIcon}>
          Basic models ·{" "}
          <span className="font-semibold">{basic.limit} / month</span>
        </Feature>
        <Feature Icon={SparkleIcon}>
          Advanced models ·{" "}
          <span className="font-semibold">{advanced.limit} / month</span>
        </Feature>
        <Feature Icon={SparklesIcon}>
          Frontier models (use premium credits)
        </Feature>
        <Feature Icon={GlobeCheckIcon}>Web search</Feature>
      </div>
      <Divider flexItem className="my-7.5" />
      <div className="flex flex-col gap-1.5">
        <p className="text-text-secondary text-sm">
          {duration === "monthly" ? "One month plan" : "One year plan"}
        </p>
        {order_id && (
          <p className="text-text-secondary text-sm">
            Order Number: {order_id}
          </p>
        )}
        {period_start > 0 && (
          <p className="text-text-secondary text-sm">
            Start date: {new Date(period_start).toLocaleDateString()}
          </p>
        )}
        {period_end > 0 && (
          <p className="text-text-secondary text-sm">
            New expiry: {new Date(period_end).toLocaleDateString()}
          </p>
        )}
      </div>
      <p className="mt-5 text-base">Total: 789 ₽</p>
    </div>
  );
}
