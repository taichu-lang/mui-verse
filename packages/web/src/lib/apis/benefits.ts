import { Benefit, Plan } from "@/lib/types/benefit";

export async function getBenefits(): Promise<Benefit[]> {
  return [
    {
      id: "b_001",
      code: "standard_chat",
      resources: [
        { type: "model", id: "gpt-4.1" },
        { type: "model", id: "claude-sonnet-4-5" },
      ],
      limit: 1000,
      unit: "request",
    },
    {
      id: "b_002",
      code: "advanced_chat",
      resources: [
        { type: "model", id: "gpt-5.4" },
        { type: "model", id: "gpt-5.5" },
        { type: "model", id: "claude-opus-4-7" },
      ],
      limit: 1000_000,
      unit: "token",
    },
  ];
}

export async function getPlans(): Promise<Plan[]> {
  return [
    {
      type: "free",
      duration: "monthly",
      prices: [],
      benefits: ["standard_chat"],
    },
    {
      type: "pro",
      duration: "monthly",
      prices: [
        {
          amount: 16,
          currency: "USD",
        },
        {
          amount: 150,
          currency: "RUB",
        },
      ],
      benefits: ["standard_chat", "advanced_chat"],
    },
    {
      type: "pro",
      duration: "yearly",
      prices: [
        {
          amount: 180,
          currency: "USD",
        },
        {
          amount: 1500,
          currency: "RUB",
        },
      ],
      benefits: ["standard_chat", "advanced_chat"],
    },
  ];
}
