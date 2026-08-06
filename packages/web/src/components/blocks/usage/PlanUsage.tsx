"use client";

import { useAuth } from "@/auth/auth";
import { AuthFilter } from "@/auth/AuthFilter";
import { FreePlanUsage } from "./FreePlanUsage";
import { ProPlanUsage } from "./ProPlanUsage";

export function PlanUsage() {
  const { session } = useAuth();

  return (
    <AuthFilter>
      {session?.subscription.plan_code === "free" ? (
        <FreePlanUsage />
      ) : (
        <ProPlanUsage />
      )}
    </AuthFilter>
  );
}
