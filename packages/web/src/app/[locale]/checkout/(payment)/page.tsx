"use client";

import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { createOrder } from "@/lib/apis/order";
import { PlanDuration } from "@/lib/types/benefit";
import { priceStringify } from "@/lib/types/currency";
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
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";

function PlanRadio({ duration }: { duration: PlanDuration }) {
  const { currency, duration: selected, updateCheckout } = useCheckout();
  const active = selected === duration;
  const { monthPrice, yearPrice, discountPercent } = useBenefit();

  const month = useMemo(() => {
    return monthPrice(currency) || 0;
  }, [monthPrice, currency]);

  const year = useMemo(() => {
    return yearPrice(currency) || 0;
  }, [yearPrice, currency]);

  const discount = useMemo(() => {
    return discountPercent(currency);
  }, [discountPercent, currency]);

  const perMonth = (year / 12).toFixed(1);
  const title = duration === "monthly" ? "One month plan" : "One year plan";
  const price =
    duration === "monthly"
      ? priceStringify(month.toString(), currency)
      : priceStringify(perMonth, currency);

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
            SAVE {discount}
          </div>
        )}
      </div>
      <span className="text-text-secondary text-sm">
        {currency} {price}/mo
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
  const router = useRouter();
  const locale = useLocale();
  const { duration, currency, updateCheckout, order } = useCheckout();
  const renderTitle = (method: PaymentMethodType) => {
    switch (method) {
      case "card":
        return "Bank card";

      default:
        return "";
    }
  };

  const handleCheckout = async (
    method: PaymentMethodType,
    provider: PaymentProviderType,
  ) => {
    console.log(method, provider);
    const order = await createOrder(
      {
        method,
        provider,
        plan_code: "pro",
        plan_duration: duration,
        currency,
      },
      locale,
    );
    if (order) {
      updateCheckout({ order });
    } else {
      toast.error("network issue");
    }
  };

  return (
    <div className="flex w-full flex-col">
      <p className="text-base">Plan details</p>
      <div className="mt-4 flex gap-2.5">
        <PlanRadio duration="monthly" />
        <PlanRadio duration="yearly" />
      </div>
      <p className="mt-7.5">Payment</p>
      <PaymentMethodProvider
        methods={["card"]}
        renderTitle={renderTitle}
        className="mt-4"
        onSwitch={handleCheckout}
      >
        <CheckoutBackdrop />
      </PaymentMethodProvider>
      {order?.external?.checkout_url && (
        <Link
          href={order.external.checkout_url}
          className="bg-primary-500 mt-5 flex h-11 items-center justify-center rounded-full text-base font-semibold text-white"
          target="_blank"
          onClick={() =>
            router.replace(`/checkout/result?order_id=${order.order_id}`)
          }
        >
          Buy now
        </Link>
      )}
      <p className="text-text-secondary mt-3.5 text-sm text-wrap">
        By making this payment, you accept the{" "}
        <span className="cursor-pointer text-sm underline">
          terms and conditions of the service
        </span>
      </p>
    </div>
  );
}
