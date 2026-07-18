"use client";

import { Button } from "@/components/ui/Button";
import { useBenefit } from "@/hooks/useBenefit";
import { useCheckout } from "@/hooks/useCheckout";
import { PlanDuration } from "@/lib/types/benefit";
import { PaymentMethodProvider } from "@mui-verse/payment/methods";
import { PaymentMethodType } from "@mui-verse/payment/types";
import { cn } from "@mui-verse/ui/utils/cn";

function PlanRadio({ duration }: { duration: PlanDuration }) {
  const { duration: selected, updateCheckout } = useCheckout();
  const active = selected === duration;
  const { plans } = useBenefit();

  const title = duration === "monthly" ? "One month plan" : "One year plan";
  const month = plans
    .find((p) => p.duration === "monthly")
    ?.prices.find((p) => p.currency === "USD")?.amount;
  const year = plans
    .find((p) => p.duration === "yearly")
    ?.prices.find((p) => p.currency === "USD")?.amount;
  if (!month || !year) {
    return null;
  }

  const perMonth = year / 12;
  const price = duration === "monthly" ? month : perMonth.toFixed(1);
  const discount = (((month - perMonth) / month) * 100).toFixed(0);

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
            SAVE {discount}%
          </div>
        )}
      </div>
      <span className="text-text-secondary text-sm">${price}/month</span>
    </div>
  );
}

export default function CheckoutPage() {
  const renderTitle = (method: PaymentMethodType) => {
    switch (method) {
      case "card":
        return "Bank card";

      default:
        return "";
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
      >
        <Button className="mt-5">Continue</Button>
      </PaymentMethodProvider>
    </div>
  );
}
