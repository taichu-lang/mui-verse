"use client";

import { useAuth } from "@/auth/auth";
import { getBalances as getUserBalances } from "@/lib/apis/balances";
import { Balance } from "@/lib/types/benefit";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

  const standard = balances.find((b) => b.benefit_code === "standard_chat");
  const advanced = balances.find((b) => b.benefit_code === "advanced_chat");
  const frontier = balances.find((b) => b.benefit_code === "frontier_chat");

  return {
    getBalances,
    standard,
    advanced,
    frontier,
  };
}
