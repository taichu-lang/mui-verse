import { BankCardIcon } from "@mui-verse/payment/icons/BankCard";
import { ChevronRightIcon } from "@mui-verse/payment/icons/ChevronRight";
import { MasterCardIcon } from "@mui-verse/payment/icons/MasterCard";
import { VisaIcon } from "@mui-verse/payment/icons/Visa";
import { YoomoneyIcon } from "@mui-verse/payment/icons/Yoomoney";
import {
  CurrencyCode,
  PaymentMethodType,
  PaymentProviderType,
} from "@mui-verse/payment/types";
import { cn } from "@mui-verse/ui/utils/cn";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface MethodMeta {
  provider: PaymentProviderType;
  Icon: React.ElementType;
}

type onSwitchFunc = (
  method: PaymentMethodType,
  provider: PaymentProviderType,
) => Promise<void>;

const rubMethodsMap: Partial<Record<PaymentMethodType, MethodMeta>> = {
  card: {
    Icon: BankCardIcon,
    provider: "dukpay",
  },
  yoomoney: {
    Icon: YoomoneyIcon,
    provider: "dukpay",
  },
};

const usdMethodsMap: Partial<Record<PaymentMethodType, MethodMeta>> = {
  card: {
    Icon: () => (
      <div className="flex items-center gap-1">
        <VisaIcon />
        <MasterCardIcon />
      </div>
    ),
    provider: "airwallex",
  },
};

export function getMethodMeta(
  method: PaymentMethodType,
  currency: CurrencyCode,
): MethodMeta {
  switch (currency) {
    case "RUB": {
      const meta = rubMethodsMap[method];
      if (meta) {
        return meta;
      }

      throw new Error(`Unsupported method ${method} for RUB.`);
    }

    case "USD": {
      const meta = usdMethodsMap[method];
      if (meta) {
        return meta;
      }

      throw new Error(`Unsupported method ${method} for USD.`);
    }

    default:
      throw new Error(`Unsupported currency ${currency}`);
  }
}

export function PaymentMethod({
  method,
  currency,
  title,
  className,
}: {
  method: PaymentMethodType;
  currency: CurrencyCode;
  title: string;
  className?: string;
}) {
  const { Icon, provider } = getMethodMeta(method, currency);
  const {
    method: selected,
    setMethod,
    onSwitch,
    loading,
    setLoading,
  } = usePaymentMethod();

  const handleChecked = async () => {
    if (loading) {
      return;
    }

    setMethod(method);
    if (onSwitch.current) {
      setLoading(true);
      try {
        await onSwitch.current?.(method, provider);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex w-full items-center gap-5 rounded-full py-2.5 pr-2.5 pl-4.5 shadow-[0px_0px_4px_0px_#6D6D6D40]",
        "hover:bg-action-hover hover:cursor-pointer",
        {
          "ring-primary-500 ring ring-inset": selected === method,
          "pointer-events-none": loading,
        },
        className,
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
  method: PaymentMethodType | null;
  onSwitch: React.RefObject<onSwitchFunc | null>;
  loading: boolean; // loading state of onSwitch.

  setMethod: (method: PaymentMethodType) => void;
  setLoading: (loading: boolean) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextValue | null>(
  null,
);

export function usePaymentMethod() {
  const context = useContext(PaymentMethodContext);
  if (!context) {
    throw new Error(
      "usePaymentMethod must be used within a PaymentMethodProvider",
    );
  }

  return context;
}

export function PaymentMethodProvider({
  currency = "RUB",
  methods,
  renderTitle,
  children,
  className,
  onSwitch,
}: {
  currency?: CurrencyCode;
  methods: PaymentMethodType[];
  renderTitle: (method: PaymentMethodType) => string;
  children?: React.ReactNode;
  className?: string;
  onSwitch?: (
    method: PaymentMethodType,
    provider: PaymentProviderType,
  ) => Promise<void>;
}) {
  const [method, setMethodState] = useState<PaymentMethodType | null>(null);
  const setMethod = useCallback((method: PaymentMethodType) => {
    setMethodState(method);
  }, []);
  const [loading, setLoadingState] = useState<boolean>(false);
  const setLoading = useCallback((loading: boolean) => {
    setLoadingState(loading);
  }, []);

  const onSwitchRef = useRef<onSwitchFunc>(onSwitch || null);
  useEffect(() => {
    if (onSwitch) {
      onSwitchRef.current = onSwitch;
    }
  }, [onSwitch]);

  return (
    <PaymentMethodContext.Provider
      value={{
        method,
        setMethod,
        onSwitch: onSwitchRef,
        loading,
        setLoading,
      }}
    >
      <div className={cn("flex flex-col gap-3", className)}>
        {methods.map((method) => (
          <PaymentMethod
            key={method}
            currency={currency}
            method={method}
            title={renderTitle(method)}
          />
        ))}
      </div>
      {children}
    </PaymentMethodContext.Provider>
  );
}
