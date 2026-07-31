import { CurrencyCode } from "@/lib/types/currency";
import { PlanDuration } from "@/lib/types/enums";
import { Checkout } from "@/lib/types/order";
import { create } from "zustand";

export interface CheckoutState {
  currency: CurrencyCode;
  duration: PlanDuration;
  from: string;
  checkout?: Checkout;
}

export interface CheckoutValue extends CheckoutState {
  resetCheckout: (duration: PlanDuration, from: string) => void;
  updateCheckout: (checkout: Partial<CheckoutState>) => void;
}

const init: CheckoutState = {
  currency: "RUB",
  duration: "monthly",
  from: "",
  checkout: undefined,
};

export const useCheckout = create<CheckoutValue>()((set) => ({
  ...init,

  resetCheckout: (duration, from) => set({ ...init, duration, from }),
  updateCheckout: (checkout) => set({ ...checkout }),
}));
