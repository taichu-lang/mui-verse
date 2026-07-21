"use client";

import { getBenefits, getPlans } from "@/lib/apis/benefits";
import { Benefit, Plan } from "@/lib/types/benefit";
import { CurrencyCode } from "@/lib/types/currency";
import { useCallback, useEffect, useState } from "react";

export function useBenefit() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const retriever = useCallback(() => {
    Promise.all([getBenefits(), getPlans()]).then(([b, p]) => {
      setBenefits(b);
      setPlans(p);
      setLoading(false);
    });
  }, []);

  useEffect(() => retriever(), [retriever]);

  const monthPrice = useCallback(
    (currency: CurrencyCode) => {
      return plans
        .find((p) => p.type === "pro" && p.duration === "monthly")
        ?.prices.find((p) => p.currency === currency)?.amount;
    },
    [plans],
  );

  const yearPrice = useCallback(
    (currency: CurrencyCode) => {
      return plans
        .find((p) => p.type === "pro" && p.duration === "yearly")
        ?.prices.find((p) => p.currency === currency)?.amount;
    },
    [plans],
  );

  return { loading, plans, benefits, monthPrice, yearPrice };
}
