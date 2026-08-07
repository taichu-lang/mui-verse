"use client";

import { useAuth } from "@/auth/auth";
import { getBenefits, getPlans } from "@/lib/apis/benefits";
import { getPreference } from "@/lib/apis/preference";
import { Benefit, Plan } from "@/lib/types/benefit";
import { CurrencyCode } from "@/lib/types/currency";
import { PlanCode } from "@/lib/types/enums";
import { Model, modelMap } from "@/lib/types/model";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { create } from "zustand";

interface BenefitStore {
  benefits: Benefit[];
  plans: Plan[];
  loading: boolean;
  retrieve: () => Promise<void>;
}

export const useBenefitStore = create<BenefitStore>()((set) => ({
  benefits: [],
  plans: [],
  loading: true,
  retrieve: async () => {
    const [b, p] = await Promise.all([getBenefits(), getPlans()]);
    set({ benefits: b, plans: p, loading: false });
  },
}));

if (typeof window !== "undefined") {
  void useBenefitStore.getState().retrieve();
}

export function useBenefit() {
  const t = useTranslations();
  const benefits = useBenefitStore((s) => s.benefits);
  const plans = useBenefitStore((s) => s.plans);
  const loading = useBenefitStore((s) => s.loading);

  const monthPrice = useCallback(
    (currency: CurrencyCode) => {
      const pro = plans.find((p) => p.code === "pro");
      if (!pro) {
        return 0;
      }

      const amount = pro.prices.find(
        (p) => p.currency === currency,
      )?.monthly_cents;
      if (amount) {
        return amount / 100;
      }

      return 0;
    },
    [plans],
  );

  const yearPrice = useCallback(
    (currency: CurrencyCode) => {
      const pro = plans.find((p) => p.code === "pro");
      if (!pro) {
        return 0;
      }

      const amount = pro.prices.find(
        (p) => p.currency === currency,
      )?.yearly_cents;
      if (amount) {
        return amount / 100;
      }

      return 0;
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
    (code: PlanCode): { quota: string; cycle: string } => {
      const plan = plans.find((p) => p.code === code);
      if (!plan) {
        return { quota: "", cycle: "" };
      }

      const benefit = plan.benefits.find((b) => b.code === "basic_models");
      if (!benefit) {
        return { quota: "", cycle: "" };
      }

      switch (benefit.billing_cycle) {
        case "daily":
          return {
            quota: `${benefit.limit} / ${t("duration.day")}`,
            cycle: t("duration.daily"),
          };

        case "monthly":
          return {
            quota: `${benefit.limit} / ${t("duration.month")}`,
            cycle: t("duration.monthly"),
          };
      }
    },
    [t, plans],
  );

  const advancedQuota = useCallback((): { quota: string; cycle: string } => {
    const plan = plans.find((p) => p.code === "pro");
    if (!plan) {
      return { quota: "", cycle: "" };
    }

    const benefit = plan.benefits.find((b) => b.code === "advanced_models");
    if (!benefit) {
      return { quota: "", cycle: "" };
    }

    switch (benefit.billing_cycle) {
      case "daily":
        return {
          quota: `${benefit.limit} / ${t("duration.day")}`,
          cycle: t("duration.daily"),
        };

      case "monthly":
        return {
          quota: `${benefit.limit} / ${t("duration.month")}`,
          cycle: t("duration.monthly"),
        };
    }
  }, [plans, t]);

  const frontierQuota = useCallback((): { quota: string; cycle: string } => {
    const plan = plans.find((p) => p.code === "pro");
    if (!plan) {
      return { quota: "", cycle: "" };
    }

    const benefit = plan.benefits.find((b) => b.code === "frontier_models");
    if (!benefit) {
      return { quota: "", cycle: "" };
    }

    switch (benefit.billing_cycle) {
      case "daily":
        return {
          quota: `${benefit.limit} ${t("pricing.credits")} / ${t("duration.day")}`,
          cycle: t("duration.daily"),
        };

      case "monthly":
        return {
          quota: `${benefit.limit} ${t("pricing.credits")} / ${t("duration.month")}`,
          cycle: t("duration.monthly"),
        };
    }
  }, [plans, t]);

  const models = useMemo(() => {
    const ms: Model[] = [];

    benefits.forEach((benefit) => {
      benefit.resources.forEach((resource) => {
        if (resource.type === "model") {
          const model = modelMap[resource.id];
          ms.push({
            ...model,
            benefit_code: benefit.code,
          });
        }
      });
    });

    return ms;
  }, [benefits]);

  const getModels = useCallback(async () => {
    const session = useAuth.getState().session;
    if (!session) {
      return models;
    }

    try {
      const preference = await getPreference();
      const pinned = preference.pinned_models;
      const pinIdxMap = new Map<string, number>();
      pinned.forEach((id, index) => pinIdxMap.set(id, index));

      return models
        .map((model) => {
          if (pinIdxMap.has(model.id)) {
            return { ...model, pinned: true };
          }

          return model;
        })
        .sort((l, r) => {
          const leftIdx = pinIdxMap.get(l.id);
          const rightIdx = pinIdxMap.get(r.id);
          const hasLeft = leftIdx !== undefined;
          const hasRight = rightIdx !== undefined;

          if (hasLeft && !hasRight) return -1;
          if (!hasLeft && hasRight) return 1;

          return 0;
        });
    } catch {
      return models;
    }
  }, [models]);

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
    getModels,
  };
}
