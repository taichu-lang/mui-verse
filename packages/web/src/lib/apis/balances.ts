import { Balance } from "@/lib/types/benefit";

export async function getBalances(): Promise<Balance[]> {
  return [
    {
      benefit_code: "standard_chat",
      unit: "request",
      used: 39,
      remaining: 1,
      limit: 40,
      period_start: 0,
      period_end: Date.now() / 1000 + 10 * 24 * 60 * 60,
      next_period_start: 0,
    },
    {
      benefit_code: "advanced_chat",
      unit: "request",
      used: 300,
      remaining: 500,
      limit: 800,
      period_start: 0,
      period_end: Date.now() / 1000 + 10 * 24 * 60 * 60,
      next_period_start: 0,
    },
    {
      benefit_code: "frontier_chat",
      unit: "token",
      used: 12.4,
      remaining: 20.6,
      limit: 40,
      period_start: 0,
      period_end: Date.now() / 1000 + 10 * 24 * 60 * 60,
      next_period_start: 0,
    },
  ];
}
