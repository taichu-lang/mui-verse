import { Pagination } from "@/lib/types/pagination";
import { Usage, UsagePageResponse } from "@/lib/types/usage";

export async function getCreditUsages(
  page: number,
  limit: number,
  signal?: AbortSignal,
): Promise<Pagination<Usage>> {
  try {
    const client = await fetch(
      `/api/users/usages?page=${page}&limit=${limit}&unit=credit`,
      {
        method: "GET",
        signal,
      },
    );
    const response = (await client.json()) as UsagePageResponse;
    if (response.code === 0) {
      return response.data;
    }
  } catch {}

  return {
    total: 0,
    page,
    limit,
    items: [],
  };
}
