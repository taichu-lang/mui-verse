export type PaymentProviderType = "dukpay" | "airwallex";
export type PaymentMethodType = "BANK_CARD" | "SBP" | "card";

export interface PaymentRequest {
  amount: number;
  currency: string;
  payment_method: PaymentMethodType;
  payment_provider: PaymentProviderType;
}

export type CheckoutType = "external" | "embedded";

export interface ExternalCheckout {
  checkout_url: string;
}

export interface EmbeddedCheckout {
  client_secret: string;
}

export interface PaymentResponse {
  payment_id: string;
  order_id: string;
  type: CheckoutType;
  external?: ExternalCheckout;
  embedded?: EmbeddedCheckout;
}

export type CreatePaymentFn = (req: PaymentRequest) => Promise<PaymentResponse>;
