"use client";

import { getBenefits, getPlans } from "@/lib/apis/benefits";
import { Benefit, Plan } from "@/lib/types/benefit";
import { useCallback, useEffect, useState } from "react";

export function useBenefit() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const retriever = useCallback(() => {
    Promise.all([getBenefits(), getPlans()]).then(([b, p]) => {
      setBenefits(b);
      setPlans(p);
    });
  }, []);

  useEffect(() => retriever(), [retriever]);

  return { plans, benefits };
}
