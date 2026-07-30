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
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations();
  const { currency, duration, order } = useCheckout();
  const { monthPrice, yearPrice, basicQuota, advancedQuota, frontierQuota } =
    useBenefit();
  const price = useMemo(() => {
    if (duration === "monthly") {
      return monthPrice(currency);
    }

    return yearPrice(currency);
  }, [duration, monthPrice, yearPrice, currency]);

  const { quota: q1 } = basicQuota("pro");
  const { quota: q2 } = advancedQuota();
  const { quota: q3 } = frontierQuota();

  return (
    <div className="checkout-plan flex w-full flex-col rounded-[40px] px-7 py-6.5">
      <div className="flex items-center justify-between">
        <p className="text-2xl">Pro plan</p>
        <CurrencySwitch />
      </div>
      <p className="mt-6 text-base">Top features</p>
      <div className="mt-5 flex flex-col gap-3.5">
        <Feature Icon={InfinityIcon}>
          {t("pricing.benefits.basic")}
          {" · "}
          <span className="font-semibold">{q1}</span>
        </Feature>
        <Feature Icon={SparkleIcon}>
          {t("pricing.benefits.advanced")}
          {" · "}
          <span className="font-semibold">{q2}</span>
        </Feature>
        <Feature Icon={SparklesIcon}>{q3}</Feature>
        <Feature Icon={GlobeCheckIcon}>{t("pricing.benefits.search")}</Feature>
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
