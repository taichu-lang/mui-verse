import { create } from "zustand";

type ActionEnum = "reset" | "add";

interface SetPasswordValue {
  email: string;
  token: string;
  action: ActionEnum;
}

export interface SetPasswordState {
  value: SetPasswordValue;

  setValue: (v: Partial<SetPasswordValue>) => void;
}

export const useSetPasswordContext = create<SetPasswordState>((set) => ({
  value: { email: "", token: "", action: "reset" },
  setValue: (v: Partial<SetPasswordValue>) =>
    set((state) => ({ value: { ...state.value, ...v } })),
}));
