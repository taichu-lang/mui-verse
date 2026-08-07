import { ApiResponse } from "./api";
import { BenefitCode, BillingUnit, ResourceType } from "./enums";
import { Pagination } from "./pagination";

export type UsageChangeType = "increment" | "decrement";

export interface UsageMetadata {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  credits?: number;
}

export interface Usage {
  id: number;
  benefit_code: BenefitCode;
  resource_type?: ResourceType;
  resource_id?: string;
  unit: BillingUnit;
  amount: number;
  change_type: UsageChangeType;
  created_at: number;
  metadata?: UsageMetadata;
}

export interface UsagePageResponse extends ApiResponse {
  data: Pagination<Usage>;
}
