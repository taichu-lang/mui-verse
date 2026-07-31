import { create } from "zustand";

type ActionEnum = "reset" | "add";

interface ChangePasswordValue {
  email: string;
  token: string;
  action: ActionEnum;
}

export interface ChangePasswordState extends ChangePasswordValue {
  setValue: (v: Partial<ChangePasswordValue>) => void;
}

export const useChangePassword = create<ChangePasswordState>((set) => ({
  email: "",
  token: "",
  action: "reset",
  setValue: (v: Partial<ChangePasswordValue>) =>
    set((state) => ({ ...state, ...v })),
}));
