"use client";

import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { createOrder } from "@/lib/apis/order";
import { stringifyPriceSymbol } from "@/lib/types/currency";
import { PlanDuration } from "@/lib/types/enums";
import {
  PaymentMethodProvider,
  usePaymentMethod,
} from "@mui-verse/payment/methods";
import {
  PaymentMethodType,
  PaymentProviderType,
} from "@mui-verse/payment/types";
import { AnimatedSpinner } from "@mui-verse/ui/components/effects";
import { cn } from "@mui-verse/ui/utils/cn";
import { Backdrop } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function PlanRadio({ duration }: { duration: PlanDuration }) {
  const t = useTranslations();
  const { currency, duration: selected, updateCheckout } = useCheckout();
  const active = selected === duration;
  const { monthPrice, yearPrice, discountPercent } = useBenefit();

  const month = monthPrice(currency) || 0;
  const year = yearPrice(currency) || 0;
  const discount = discountPercent(currency);

  const title =
    duration === "monthly"
      ? t("payment.checkout.oneMonth")
      : t("payment.checkout.oneYear");
  const price = duration === "monthly" ? month : year / 12;

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer flex-col gap-2.5 rounded-[18px] px-5 pt-4 pb-4.5",
        {
          "bg-[#F7F7F7]": !active,
          "plan-radio": active,
        },
      )}
      onClick={() => updateCheckout({ duration })}
    >
      <div className="flex items-center">
        <span className="text-base">{title}</span>
        <div className="flex-1" />
        {duration === "yearly" && (
          <div className="bg-primary-light text-primary-500 flex w-18 justify-center rounded-full py-1 text-xs">
            {t("pricing.discount", { discount })}
          </div>
        )}
      </div>
      <span className="text-text-secondary text-sm">
        {stringifyPriceSymbol(price, currency)}/{t("duration.month")}
      </span>
    </div>
  );
}

function CheckoutBackdrop() {
  const { loading } = usePaymentMethod();

  return (
    <Backdrop
      open={loading}
      onClick={() => {}} // do not close the backdrop
      sx={(theme) => ({
        bgcolor: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(4px) saturate(180%)",
        zIndex: theme.zIndex.drawer + 10,
      })}
    >
      <AnimatedSpinner />
    </Backdrop>
  );
}

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { duration, currency, updateCheckout, checkout } = useCheckout();
  const renderTitle = (method: PaymentMethodType) => {
    switch (method) {
      case "card":
        return t(`payment.method.${method}`);

      default:
        return "";
    }
  };

  const handleCheckout = async (
    method: PaymentMethodType,
    provider: PaymentProviderType,
  ) => {
    console.log(method, provider);
    const checkout = await createOrder(
      {
        method,
        provider,
        plan_code: "pro",
        period_type: duration,
        currency,
      },
      locale,
    );
    if (checkout) {
      updateCheckout({ checkout });
    } else {
      toast.error(t("error.network"));
    }
  };

  return (
    <div className="flex w-full flex-col">
      <p className="text-base">{t("payment.checkout.plans")}</p>
      <div className="mt-4 flex gap-2.5">
        <PlanRadio duration="monthly" />
        <PlanRadio duration="yearly" />
      </div>
      <p className="mt-7.5">{t("payment.checkout.methods")}</p>
      <PaymentMethodProvider
        methods={["card"]}
        renderTitle={renderTitle}
        className="mt-4"
        onSwitch={handleCheckout}
      >
        <CheckoutBackdrop />
      </PaymentMethodProvider>
      {checkout?.external?.checkout_url && (
        <Link
          href={checkout.external.checkout_url}
          className="bg-primary-500 mt-5 flex h-11 items-center justify-center rounded-full text-base font-semibold text-white"
          target="_blank"
          onClick={() =>
            router.replace(`/checkout/result?order_id=${checkout.order_id}`)
          }
        >
          {t("payment.checkout.buy")}
        </Link>
      )}
      <p className="text-text-secondary mt-3.5 text-sm text-wrap">
        {t.rich("payment.checkout.terms", {
          link: (chunks) => {
            return (
              <Link href={"/tos"} className="underline">
                {chunks}
              </Link>
            );
          },
        })}
      </p>
    </div>
  );
}
