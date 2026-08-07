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
import { stringifyPriceSymbol } from "@/lib/types/currency";
import { PlanDuration } from "@/lib/types/enums";
import { Checkout } from "@/lib/types/order";
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

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-text-secondary line-clamp-2 text-sm break-all">
        {label}
      </span>
      <span className="text-text-primary line-clamp-2 text-sm break-all">
        {value}
      </span>
    </>
  );
}

function CheckoutInfo({
  checkout,
  duration,
}: {
  checkout?: Checkout;
  duration: PlanDuration;
}) {
  const t = useTranslations();
  const locale = useLocale();
  if (!checkout) {
    return null;
  }

  return (
    <div className="grid grid-cols-[max-content_1fr] items-start gap-x-4 gap-y-1.5">
      <DataItem
        label={t("pricing.plan")}
        value={
          duration === "monthly"
            ? t("duration.oneMonth")
            : t("duration.oneYear")
        }
      />

      <DataItem
        label={t("payment.checkout.orderNumber")}
        value={checkout.order_id}
      />

      {checkout.subscription_start_at > 0 && (
        <DataItem
          label={t("payment.checkout.orderStart")}
          value={stringifyDate(checkout.subscription_start_at, locale)}
        />
      )}

      {checkout.subscription_end_at > 0 && (
        <DataItem
          label={t("payment.checkout.orderEnd")}
          value={stringifyDate(checkout.subscription_end_at, locale)}
        />
      )}
    </div>
  );
}

export default function PlanPage() {
  const t = useTranslations();
  const { currency, duration, checkout } = useCheckout();
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
        <p className="text-2xl">{t("payment.checkout.proPlan")}</p>
        <CurrencySwitch />
      </div>
      <p className="mt-6 text-base">{t("payment.checkout.features")}</p>
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
      <CheckoutInfo checkout={checkout} duration={duration} />
      <p className="mt-5 text-base">
        {t("payment.checkout.total")}: {stringifyPriceSymbol(price, currency)}
      </p>
    </div>
  );
}
