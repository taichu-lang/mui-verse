import { PlanDuration } from "@/lib/types/benefit";
import { CurrencyCode } from "@/lib/types/currency";
import { create } from "zustand";

export interface CheckoutState {
  currency: CurrencyCode;
  duration: PlanDuration;
  order_id: string;
  from: string;
  period_start: number;
  period_end: number;
}

export interface CheckoutValue extends CheckoutState {
  resetCheckout: (duration: PlanDuration, from: string) => void;
  updateCheckout: (checkout: Partial<CheckoutState>) => void;
}

const init: CheckoutState = {
  currency: "RUB",
  duration: "monthly",
  order_id: "",
  from: "",
  period_start: 0,
  period_end: 0,
};

export const useCheckout = create<CheckoutValue>()((set) => ({
  ...init,

  resetCheckout: (duration, from) => set({ ...init, duration, from }),
  updateCheckout: (checkout) => set({ ...checkout }),
}));
