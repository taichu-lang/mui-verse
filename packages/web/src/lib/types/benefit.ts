type BenefitCode = "standard_chat" | "advanced_chat";
type ResourceType = "model" | "tool";
type BillingUnit = "request" | "token";
export type CurrencyCode = "RUB" | "USD";
type PlanCode = "free" | "pro";
export type PlanDuration = "monthly" | "yearly";

export interface Resource {
  type: ResourceType;
  id: string;
}

export interface Benefit {
  id: string;
  code: BenefitCode;
  resources: Resource[];
  limit: number;
  unit: BillingUnit;
}

export interface Subscription {
  plan: PlanCode;
  benefits: Benefit[];
}

export interface Balance {
  benefit_code: BenefitCode;
  used: number;
  remaining: number;
}

export interface Price {
  currency: CurrencyCode;
  amount: number;
}

export interface Plan {
  type: PlanCode;
  duration: PlanDuration;
  prices: Price[];
  benefits: string[];
}
