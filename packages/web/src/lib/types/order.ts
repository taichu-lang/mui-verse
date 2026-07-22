import {
  PaymentMethodType,
  PaymentProviderType,
  PaymentResponse,
} from "@mui-verse/payment/types";
import { ApiResponse } from "./api";
import { PlanCode, PlanDuration } from "./benefit";
import { CurrencyCode } from "./currency";

export type OrderStatus = "pending" | "success" | "failed";

export interface Order extends PaymentResponse {
  period_start: number;
  period_end: number;
  status: OrderStatus;
}

export interface OrderRequest {
  plan_code: PlanCode;
  plan_duration: PlanDuration;
  currency: CurrencyCode;
  method: PaymentMethodType;
  provider: PaymentProviderType;
}

export interface OrderResponse extends ApiResponse {
  data: Order;
}
