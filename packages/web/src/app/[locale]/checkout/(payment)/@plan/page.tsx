"use client";

import {
  GlobeCheckIcon,
  InfinityIcon,
  SparkleIcon,
  SparklesIcon,
} from "@/components/icons";
import { CurrencySwitch } from "@/components/ui/CurrencySwitch";
import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { stringifyDate } from "@/lib/time";
import { priceStringify } from "@/lib/types/currency";
import { Order } from "@/lib/types/order";
import { Divider } from "@mui/material";
import { useLocale } from "next-intl";
import { useMemo } from "react";

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

function OrderInfo({ order }: { order?: Order }) {
  const locale = useLocale();
  if (!order) {
    return null;
  }

  return (
    <>
      <p className="text-text-secondary text-sm">
        Order Number: {order.order_id}
      </p>
      {order.period_start > 0 && (
        <p className="text-text-secondary text-sm">
          Start date: {stringifyDate(order.period_start, locale)}
        </p>
      )}
      {order.period_end > 0 && (
        <p className="text-text-secondary text-sm">
          New expiry: {stringifyDate(order.period_end, locale)}
        </p>
      )}
    </>
  );
}

export default function PlanPage() {
  const { currency, duration, order } = useCheckout();
  const { benefits, monthPrice, yearPrice } = useBenefit();
  const basic = benefits.find((b) => b.code === "standard_chat");
  const advanced = benefits.find((b) => b.code === "advanced_chat");
  const price = useMemo(() => {
    if (duration === "monthly") {
      return monthPrice(currency);
    }

    return yearPrice(currency);
  }, [duration, monthPrice, yearPrice, currency]);

  if (!basic || !advanced) {
    return null;
  }

  return (
    <div className="checkout-plan flex w-full flex-col rounded-[40px] px-7 py-6.5">
      <div className="flex items-center justify-between">
        <p className="text-2xl">Pro plan</p>
        <CurrencySwitch />
      </div>
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
        <OrderInfo order={order} />
      </div>
      <p className="mt-5 text-base">
        Total: {priceStringify(price.toString(), currency)}
      </p>
    </div>
  );
}
