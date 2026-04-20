"use client";

import {
  createElement,
  ElementOptionsTypes,
  ElementTypes,
} from "@airwallex/components-sdk";
import { PaymentResponse } from "@mui-verse/payment/types";
import { FormError } from "@mui-verse/ui/components/inputs";
import { cn } from "@mui-verse/ui/utils/cn";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Typography,
} from "@mui/material";
import { CreditCard } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { AirwallexLocale, initPayments } from "./util";

interface PaymentError {
  code: string;
  message: string;
}

type CardContextValue = {
  numberElement: ElementTypes["cardNumber"] | null;
  numberElementComplete: boolean;
  expiryElementComplete: boolean;
  cvcElementComplete: boolean;
};

const initialCardContext: CardContextValue = {
  numberElement: null,
  numberElementComplete: false,
  expiryElementComplete: false,
  cvcElementComplete: false,
};

const CardContext = createContext<{
  value: CardContextValue;
  setValue: React.Dispatch<React.SetStateAction<CardContextValue>>;
} | null>(null);

function useCardContext() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCardContext must be used within AirwallexCard");
  return ctx;
}

function CardElement<T extends keyof ElementOptionsTypes>({
  type,
  className,
}: {
  type: T;
  className?: string;
}) {
  const { setValue } = useCardContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = `${type}-element`;

  useEffect(() => {
    let element: ElementTypes[T] | null = null;

    const onReady = (event: CustomEvent) => {
      console.log(`${event.detail} is mounted.`);
      setLoading(false);
    };

    const onChange = (event: CustomEvent) => {
      const { complete } = event.detail;

      setValue((prev) => {
        if (type === "cardNumber") {
          return { ...prev, numberElementComplete: complete };
        }
        if (type === "expiry") {
          return { ...prev, expiryElementComplete: complete };
        }
        if (type === "cvc") {
          return { ...prev, cvcElementComplete: complete };
        }

        return prev;
      });
    };

    const onBlur = (event: CustomEvent) => {
      const { error } = event.detail;
      const message = error?.message ?? null;
      setError(message);
    };

    const onFocus = () => {
      setError(null);
    };

    const initElement = async () => {
      const option = {
        allowedCardNetworks: ["mastercard", "visa"],
      };
      element = await createElement(type, option as ElementOptionsTypes[T]);
      if (!element) return;

      if (type === "cardNumber") {
        setValue((prev) => ({
          ...prev,
          numberElement: element as ElementTypes["cardNumber"],
        }));
      }

      const dom = document.getElementById(id);
      dom?.addEventListener("onReady", onReady as EventListener);
      dom?.addEventListener("onChange", onChange as EventListener);
      dom?.addEventListener("onBlur", onBlur as EventListener);
      dom?.addEventListener("onFocus", onFocus);

      element.mount(id);
    };

    initElement();

    return () => {
      if (element) {
        element.unmount();
        element.destroy();
      }
      const dom = document.getElementById(id);
      dom?.removeEventListener("onReady", onReady as EventListener);
      dom?.removeEventListener("onChange", onChange as EventListener);
      dom?.removeEventListener("onBlur", onBlur as EventListener);
      dom?.removeEventListener("onFocus", onFocus);
    };
  }, [id, type, setValue]);

  return (
    <div className={cn("relative mt-1 mb-8", className)}>
      <div className="flex flex-col">
        <div id={id} className={cn("rounded-md p-1", !loading && "border")} />
        <FormError message={error} />
      </div>
      {loading && (
        <Skeleton
          variant="rounded"
          className="absolute inset-0 min-h-8"
          height={"100%"}
        />
      )}
    </div>
  );
}

// Refer to: https://www.airwallex.com/docs/payments/online-payments/embedded-elements/split-card-element/guest-user-checkout
export function AirwallexCard({
  order,
  locale = "en",
  onSucceed,
  onError,
}: {
  order: PaymentResponse;
  locale: AirwallexLocale;
  onSucceed?: () => void;
  onError?: (message: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<CardContextValue>(initialCardContext);

  useEffect(() => {
    initPayments(locale).then(() => setLoading(false));
  }, [locale]);

  const handlePay = async () => {
    const {
      numberElement,
      numberElementComplete,
      expiryElementComplete,
      cvcElementComplete,
    } = value;
    if (
      !numberElement ||
      !numberElementComplete ||
      !expiryElementComplete ||
      !cvcElementComplete
    ) {
      return;
    }

    console.log("pay with elements", { numberElement });

    try {
      const response = await numberElement.confirm({
        intent_id: order.payment_id,
        client_secret: order.embedded!.client_secret,
      });

      // status: "SUCCEEDED"
      console.log("payment result: ", response);
      onSucceed?.();
    } catch (err) {
      // code: "3ds_cancel_success", details: undefined, message: "您已取消支付验证。请重试或选择其他支付方式。"
      // code: "authentication_declined", message: "您未能成功验证付款。请重试，如果重试失败，请联系您的发卡行或切换至其他支付方式。"
      console.log("payment error: ", err);
      const pe = err as PaymentError;
      if (pe.code === "3ds_cancel_success") {
        return;
      }

      onError?.(pe.message);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <CardContext.Provider value={{ value, setValue }}>
      <Card className="rounded-lg border border-gray-300 p-4 shadow-md">
        <CardHeader
          avatar={
            <Avatar className="bg-error-200 text-error-400">
              <CreditCard className="h-5 w-5" />
            </Avatar>
          }
          title={"Bank card"}
        />
        <CardContent className="flex flex-col">
          <Typography variant="subtitle2">Card number</Typography>
          <CardElement type="cardNumber" className="md:w-md" />
          <div className="flex items-start justify-between">
            <div className="flex w-32 flex-col">
              <Typography variant="subtitle2">Expiration date</Typography>
              <CardElement type="expiry" />
            </div>
            <div className="flex w-32 flex-col">
              <Typography variant="subtitle2">Code</Typography>
              <CardElement type="cvc" />
            </div>
          </div>
          <Button onClick={handlePay}>Pay</Button>
        </CardContent>
      </Card>
    </CardContext.Provider>
  );
}
