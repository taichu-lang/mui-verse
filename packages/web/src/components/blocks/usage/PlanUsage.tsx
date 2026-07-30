"use client";

import { AuthFilter } from "@/auth/AuthFilter";
import { ProPlanUsage } from "./ProPlanUsage";

export function PlanUsage() {
  return (
    <AuthFilter>
      <ProPlanUsage />
    </AuthFilter>
  );
}
