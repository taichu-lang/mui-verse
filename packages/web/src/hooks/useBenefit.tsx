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
      return (
        plans
          .find((p) => p.type === "pro" && p.duration === "monthly")
          ?.prices.find((p) => p.currency === currency)?.amount || 0
      );
    },
    [plans],
  );

  const yearPrice = useCallback(
    (currency: CurrencyCode) => {
      return (
        plans
          .find((p) => p.type === "pro" && p.duration === "yearly")
          ?.prices.find((p) => p.currency === currency)?.amount || 0
      );
    },
    [plans],
  );

  const discountPercent = useCallback(
    (currency: CurrencyCode) => {
      const month = monthPrice(currency);
      const year = yearPrice(currency);
      if (month === 0 || year === 0) {
        return "";
      }

      const perMonth = year / 12;
      const discount = (((month - perMonth) * 100) / month).toFixed(0);
      return `${discount}%`;
    },
    [monthPrice, yearPrice],
  );

  return { loading, plans, benefits, monthPrice, yearPrice, discountPercent };
}
