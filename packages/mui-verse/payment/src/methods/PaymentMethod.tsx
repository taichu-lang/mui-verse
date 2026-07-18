import { BankCardIcon } from "@mui-verse/payment/icons/BankCard";
import { ChevronRightIcon } from "@mui-verse/payment/icons/ChevronRight";
import { YoomoneyIcon } from "@mui-verse/payment/icons/Yoomoney";
import {
  PaymentMethodType,
  PaymentProviderType,
} from "@mui-verse/payment/types";
import { cn } from "@mui-verse/ui/utils/cn";
import { createContext, useCallback, useContext, useState } from "react";

interface MethodMeta {
  provider: PaymentProviderType;
  Icon: React.ElementType;
}

const metaMap: Record<PaymentMethodType, MethodMeta> = {
  card: {
    Icon: BankCardIcon,
    provider: "dukpay",
  },
  yoomoney: {
    Icon: YoomoneyIcon,
    provider: "dukpay",
  },
};

export function PaymentMethod({
  method,
  title,
  className,
}: {
  method: PaymentMethodType;
  title: string;
  className?: string;
}) {
  const Icon = metaMap[method].Icon;
  const { method: selected, setMethod, setProvider } = usePaymentMethod();

  const handleChecked = () => {
    setMethod(method);
    setProvider(metaMap[method].provider);
  };

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center gap-5 rounded-full py-2.5 pr-2.5 pl-4.5 shadow-[0px_0px_4px_0px_#6D6D6D40]",
        className,
        {
          "bg-primary-light": selected === method,
        },
      )}
      onClick={handleChecked}
    >
      <Icon />
      {title}
      <div className="flex-1" />
      <div className="flex h-6 w-6 items-center justify-center">
        <ChevronRightIcon />
      </div>
    </div>
  );
}

interface PaymentMethodContextValue {
  provider: PaymentProviderType | null;
  method: PaymentMethodType | null;

  setMethod: (method: PaymentMethodType) => void;
  setProvider: (provider: PaymentProviderType) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextValue | null>(
  null,
);

function usePaymentMethod() {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error(
      "usePaymentMethod must be used within a PaymentMethodProvider",
    );
  }

  return context;
}

export function PaymentMethodProvider({
  methods,
  renderTitle,
  children,
  className,
}: {
  methods: PaymentMethodType[];
  renderTitle: (method: PaymentMethodType) => string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [provider, setProviderState] = useState<PaymentProviderType | null>(
    null,
  );
  const [method, setMethodState] = useState<PaymentMethodType | null>(null);
  const setProvider = useCallback((provider: PaymentProviderType) => {
    setProviderState(provider);
  }, []);
  const setMethod = useCallback((method: PaymentMethodType) => {
    setMethodState(method);
  }, []);

  return (
    <PaymentMethodContext.Provider
      value={{ provider, method, setMethod, setProvider }}
    >
      <div className={cn("flex flex-col gap-3", className)}>
        {methods.map((method) => (
          <PaymentMethod
            key={method}
            method={method}
            title={renderTitle(method)}
          />
        ))}
      </div>
      {children}
    </PaymentMethodContext.Provider>
  );
}
