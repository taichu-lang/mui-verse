import { ApiResponse } from "./api";
import { CurrencyCode } from "./currency";
import {
  BenefitCode,
  BillingCycle,
  BillingUnit,
  PlanCode,
  PlanDuration,
  ResourceType,
} from "./enums";

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
  unit: BillingUnit;
  used: number;
  remaining: number;
  limit: number;
  period_start: number;
  period_end: number;
  next_period_start: number;
}

export interface Price {
  currency: CurrencyCode;
  period_type: PlanDuration;
  // amount unit is cent.
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
  prices: Price[];
  benefits: PlanBenefit[];
}

export function getPlanBenefit(
  code: BenefitCode,
  plan?: Plan,
): PlanBenefit | undefined {
  return plan?.benefits.find((b) => b.code === code);
}

export interface BenefitsResponse extends ApiResponse {
  data: Benefit[];
}

export interface PlansResponse extends ApiResponse {
  data: Plan[];
}

export interface BalancesResponse extends ApiResponse {
  data: Balance[];
}
