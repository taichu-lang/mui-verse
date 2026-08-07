import {
  PaymentMethodType,
  PaymentProviderType,
  PaymentResponse,
} from "@mui-verse/payment/types";
import { ApiResponse } from "./api";
import { CurrencyCode } from "./currency";
import { PlanCode, PlanDuration } from "./enums";

export type OrderStatusEnum = "pending" | "success" | "failed";

export interface CheckoutRequest {
  plan_code: PlanCode;
  period_type: PlanDuration;
  currency: CurrencyCode;
  method: PaymentMethodType;
  provider: PaymentProviderType;
}

export interface Checkout extends PaymentResponse {
  subscription_start_at: number;
  subscription_end_at: number;
}

export interface CheckoutResponse extends ApiResponse {
  data: Checkout;
}

export interface OrderStatus {
  order_id: string;
  status: OrderStatusEnum;
}

export interface Order extends OrderStatus {
  id: number;
  payment_id: string;
  plan_code: PlanCode;
  plan_duration: PlanDuration;
  currency: CurrencyCode;
  amount: number;
  created_at: number;
}

export interface OrderStatusResponse extends ApiResponse {
  data: OrderStatus;
}

export interface OrderPageResponse extends ApiResponse {
  data: Order[];
}
