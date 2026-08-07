"use client";

import { useAuth } from "@/auth/auth";
import { getBalances as getUserBalances } from "@/lib/apis/balances";
import { Balance } from "@/lib/types/benefit";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useBenefit } from "./useBenefit";

interface UserBalances {
  balances: Balance[];
}

interface BalancesValue extends UserBalances {
  setBalances: (balances: Balance[]) => void;
}

const useBalanceStore = create<BalancesValue>()(
  persist(
    (set) => ({
      balances: [],
      setBalances: (balances) => set({ balances }),
    }),
    {
      name: "x-balance-db",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useBalance() {
  const t = useTranslations();
  const { session } = useAuth();
  const setBalances = useBalanceStore((s) => s.setBalances);
  const balances = useBalanceStore((s) => s.balances);
  const { availableModels } = useBenefit();

  const getBalances = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      const b = await getUserBalances();
      setBalances(b);
    } catch {
      toast.error(t("error.system"));
    }
  }, [session, setBalances, t]);

  const updateBalance = useCallback(
    (b: Balance) => {
      setBalances(
        balances.map((item) =>
          item.benefit_code === b.benefit_code ? b : item,
        ),
      );
    },
    [balances, setBalances],
  );

  const standard = balances.find((b) => b.benefit_code === "basic_models");
  const advanced = balances.find((b) => b.benefit_code === "advanced_models");
  const frontier = balances.find((b) => b.benefit_code === "frontier_models");

  const getModelBalance = useCallback(
    (model: string) => {
      const benefit = availableModels.find((m) => m.id === model);
      if (!benefit) {
        return standard;
      }

      switch (benefit.benefit_code) {
        case "basic_models":
          return standard;

        case "advanced_models":
          return advanced;

        case "frontier_models":
          return frontier;

        default:
          return standard;
      }
    },
    [availableModels, standard, advanced, frontier],
  );

  return {
    getBalances,
    updateBalance,
    standard,
    advanced,
    frontier,
    getModelBalance,
  };
}
