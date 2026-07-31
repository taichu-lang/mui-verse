import {
  PaymentMethodType,
  PaymentProviderType,
  PaymentResponse,
} from "@mui-verse/payment/types";
import { ApiResponse } from "./api";
import { CurrencyCode } from "./currency";
import { PlanCode, PlanDuration } from "./enums";

export type OrderStatus = "pending" | "success" | "failed";

export interface CheckoutRequest {
  plan_code: PlanCode;
  plan_duration: PlanDuration;
  currency: CurrencyCode;
  method: PaymentMethodType;
  provider: PaymentProviderType;
}

export interface Checkout extends PaymentResponse {
  period_start: number;
  period_end: number;
  status: OrderStatus;
}

export interface CheckoutResponse extends ApiResponse {
  data: Checkout;
}

export interface Order {
  id: number;
  order_id: string;
  payment_id: string;
  plan_code: PlanCode;
  plan_duration: PlanDuration;
  currency: CurrencyCode;
  amount: number;
  status: OrderStatus;
  created_at: number;
}
