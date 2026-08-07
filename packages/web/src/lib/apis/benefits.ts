import {
  Benefit,
  BenefitsResponse,
  Plan,
  PlansResponse,
} from "@/lib/types/benefit";

export async function getBenefits(): Promise<Benefit[]> {
  const client = await fetch("/api/benefits", {
    method: "GET",
  });
  const response = (await client.json()) as BenefitsResponse;
  if (response.code === 0) {
    const benefits = response.data.filter((b) => b.code !== "web_search");
    return benefits;
  }

  return [];
}

export async function getPlans(): Promise<Plan[]> {
  const client = await fetch("/api/plans", {
    method: "GET",
  });
  const response = (await client.json()) as PlansResponse;
  if (response.code === 0) {
    return response.data;
  }

  return [];
}
