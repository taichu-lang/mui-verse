"use client";

import { getBenefits, getPlans } from "@/lib/apis/benefits";
import { Benefit, Plan, PlanCode } from "@/lib/types/benefit";
import { CurrencyCode } from "@/lib/types/currency";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export function useBenefit() {
  const t = useTranslations();
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
      const pro = plans.find((p) => p.code === "pro");
      if (!pro) {
        return 0;
      }

      const monthly = pro.prices.monthly;
      if (!monthly) {
        return 0;
      }

      return monthly.find((p) => p.currency === currency)?.amount || 0;
    },
    [plans],
  );

  const yearPrice = useCallback(
    (currency: CurrencyCode) => {
      const pro = plans.find((p) => p.code === "pro");
      if (!pro) {
        return 0;
      }

      const yearly = pro.prices.yearly;
      if (!yearly) {
        return 0;
      }

      return yearly.find((p) => p.currency === currency)?.amount || 0;
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

  const basicQuota = useCallback(
    (code: PlanCode) => {
      const plan = plans.find((p) => p.code === code);
      if (!plan) {
        return "";
      }

      const benefit = plan.benefits.find((b) => b.code === "standard_chat");
      if (!benefit) {
        return "";
      }

      switch (benefit.billing_cycle) {
        case "daily":
          return `${benefit.limit} / ${t("duration.daily")}`;

        case "monthly":
          return `${benefit.limit} / ${t("duration.monthly")}`;
      }
    },
    [t, plans],
  );

  const advancedQuota = useCallback(() => {
    const plan = plans.find((p) => p.code === "pro");
    if (!plan) {
      return "";
    }

    const benefit = plan.benefits.find((b) => b.code === "advanced_chat");
    if (!benefit) {
      return "";
    }

    switch (benefit.billing_cycle) {
      case "daily":
        return `${benefit.limit} / ${t("duration.daily")}`;

      case "monthly":
        return `${benefit.limit} / ${t("duration.monthly")}`;
    }
  }, [plans, t]);

  const frontierQuota = useCallback(() => {
    const plan = plans.find((p) => p.code === "pro");
    if (!plan) {
      return "";
    }

    const benefit = plan.benefits.find((b) => b.code === "frontier_chat");
    if (!benefit) {
      return "";
    }

    switch (benefit.billing_cycle) {
      case "daily":
        return `${benefit.limit} ${t("pricing.credits")} / ${t("duration.daily")}`;

      case "monthly":
        return `${benefit.limit} ${t("pricing.credits")} / ${t("duration.monthly")}`;
    }
  }, [plans, t]);

  return {
    loading,
    plans,
    benefits,
    monthPrice,
    yearPrice,
    discountPercent,
    basicQuota,
    advancedQuota,
    frontierQuota,
  };
}
