import { PlanDuration } from "@/lib/types/benefit";
import { CurrencyCode } from "@/lib/types/currency";
import { Order } from "@/lib/types/order";
import { create } from "zustand";

export interface CheckoutState {
  currency: CurrencyCode;
  duration: PlanDuration;
  from: string;
  order?: Order;
}

export interface CheckoutValue extends CheckoutState {
  resetCheckout: (duration: PlanDuration, from: string) => void;
  updateCheckout: (checkout: Partial<CheckoutState>) => void;
}

const init: CheckoutState = {
  currency: "RUB",
  duration: "monthly",
  from: "",
  order: undefined,
};

export const useCheckout = create<CheckoutValue>()((set) => ({
  ...init,

  resetCheckout: (duration, from) => set({ ...init, duration, from }),
  updateCheckout: (checkout) => set({ ...checkout }),
}));
