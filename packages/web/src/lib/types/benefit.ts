import { CurrencyCode } from "./currency";

type BenefitCode = "standard_chat" | "advanced_chat" | "frontier_chat";
type ResourceType = "model" | "tool";
type BillingUnit = "request" | "token";
type BillingCycle = "daily" | "monthly";
export type PlanCode = "free" | "pro";
export type PlanDuration = "monthly" | "yearly";

export interface Resource {
  type: ResourceType;
  id: string;
}

export interface Benefit {
  id: number;
  code: BenefitCode;
  resources: Resource[];
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

export interface PlanBenefit {
  code: BenefitCode;
  unit: BillingUnit;
  limit: number;
  billing_cycle: BillingCycle;
}

export interface Plan {
  code: PlanCode;
  prices: Record<PlanDuration, Price[]>;
  benefits: PlanBenefit[];
}

export function getPlanBenefit(
  code: BenefitCode,
  plan?: Plan,
): PlanBenefit | undefined {
  return plan?.benefits.find((b) => b.code === code);
}
