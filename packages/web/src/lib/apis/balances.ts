import { Balance, BalancesResponse } from "@/lib/types/benefit";

export async function getBalances(): Promise<Balance[]> {
  const client = await fetch("/api/users/balances", {
    method: "GET",
  });
  const response = (await client.json()) as BalancesResponse;
  if (response.code === 0) {
    return response.data;
  }

  return [];
}
