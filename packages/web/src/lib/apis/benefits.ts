import { Benefit, Plan } from "@/lib/types/benefit";

export async function getBenefits(): Promise<Benefit[]> {
  return [
    {
      id: 1,
      code: "standard_chat",
      resources: [
        { type: "model", id: "gpt-4.1-nano" },
        { type: "model", id: "gpt-5.4-nano" },
        { type: "model", id: "gpt-5.4-mini" },
        { type: "model", id: "gpt-5.6-luna" },
        { type: "model", id: "gemini-3-flash-preview" },
        { type: "model", id: "claude-haiku-4-5" },
      ],
    },
    {
      id: 2,
      code: "advanced_chat",
      resources: [
        { type: "model", id: "gpt-4o" },
        { type: "model", id: "gpt-5.4" },
        { type: "model", id: "gpt-5.3-codex" },
        { type: "model", id: "gpt-5.6-terra" },
        { type: "model", id: "gemini-3.1-pro-preview" },
        { type: "model", id: "claude-sonnet-4-6" },
        { type: "model", id: "claude-sonnet-4-5" },
      ],
    },
    {
      id: 3,
      code: "frontier_chat",
      resources: [
        { type: "model", id: "gpt-5.5" },
        { type: "model", id: "gpt-5.6-sol" },
        { type: "model", id: "claude-opus-4-7" },
        { type: "model", id: "claude-opus-4-6" },
        { type: "model", id: "claude-opus-4-5" },
      ],
    },
  ];
}

export async function getPlans(): Promise<Plan[]> {
  return [
    {
      code: "free",
      prices: {
        monthly: [],
        yearly: [],
      },
      benefits: [
        {
          code: "standard_chat",
          unit: "request",
          billing_cycle: "daily",
          limit: 40,
        },
      ],
    },
    {
      code: "pro",
      prices: {
        monthly: [
          {
            amount: 16,
            currency: "USD",
          },
          {
            amount: 150,
            currency: "RUB",
          },
        ],
        yearly: [
          {
            amount: 160,
            currency: "USD",
          },
          {
            amount: 1500,
            currency: "RUB",
          },
        ],
      },
      benefits: [
        {
          code: "standard_chat",
          unit: "request",
          billing_cycle: "monthly",
          limit: 2000,
        },
        {
          code: "advanced_chat",
          unit: "request",
          billing_cycle: "monthly",
          limit: 300,
        },
        {
          code: "frontier_chat",
          unit: "token",
          billing_cycle: "monthly",
          limit: 800,
        },
      ],
    },
  ];
}
