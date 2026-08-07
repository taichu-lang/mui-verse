import { Pagination } from "@/lib/types/pagination";
import { Usage } from "@/lib/types/usage";

export async function getCreditUsages(
  page: number,
  limit: number,
  signal?: AbortSignal,
): Promise<Pagination<Usage>> {
  signal?.throwIfAborted();
  if (page === 1) {
    return {
      page,
      limit,
      total: 15,
      items: [
        {
          id: 15,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 80,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 321,
          },
        },
        {
          id: 14,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 80,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 321,
          },
        },
        {
          id: 13,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 80,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 321,
          },
        },
        {
          id: 12,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 80,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 321,
          },
        },
        {
          id: 11,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 80,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 321,
          },
        },
        {
          id: 10,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 80,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 321,
          },
        },
        {
          id: 9,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 100,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 2321,
          },
        },
        {
          id: 8,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 100,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 2321,
          },
        },
        {
          id: 7,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 100,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 2321,
          },
        },
        {
          id: 6,
          benefit_code: "frontier_models",
          resource_type: "model",
          resource_id: "claude-opus-4-7",
          unit: "token",
          amount: 100,
          change_type: "decrement",
          created_at: 1785724838,
          metadata: {
            total_tokens: 2321,
          },
        },
      ],
    };
  }

  return {
    page,
    limit,
    total: 15,
    items: [
      {
        id: 5,
        benefit_code: "frontier_models",
        resource_type: "model",
        resource_id: "claude-opus-4-7",
        unit: "token",
        amount: 100,
        change_type: "decrement",
        created_at: 1785724838,
        metadata: {
          total_tokens: 2321,
        },
      },
      {
        id: 4,
        benefit_code: "frontier_models",
        resource_type: "model",
        resource_id: "claude-opus-4-7",
        unit: "token",
        amount: 100,
        change_type: "decrement",
        created_at: 1785724838,
        metadata: {
          total_tokens: 2321,
        },
      },
      {
        id: 3,
        benefit_code: "frontier_models",
        resource_type: "model",
        resource_id: "claude-opus-4-7",
        unit: "token",
        amount: 100,
        change_type: "decrement",
        created_at: 1785724838,
        metadata: {
          total_tokens: 2321,
        },
      },
      {
        id: 2,
        benefit_code: "frontier_models",
        resource_type: "model",
        resource_id: "claude-opus-4-7",
        unit: "token",
        amount: 100,
        change_type: "decrement",
        created_at: 1785724838,
        metadata: {
          total_tokens: 2321,
        },
      },
      {
        id: 1,
        benefit_code: "frontier_models",
        unit: "token",
        amount: 3000,
        change_type: "increment",
        created_at: 1694502400,
      },
    ],
  };
}
