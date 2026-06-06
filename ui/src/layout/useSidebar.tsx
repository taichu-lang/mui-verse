import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { useEffect } from "react";
import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;
  initialized: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  initFromMobile: (isMobile: boolean) => void;
}

export const useSidebar = create<SidebarState>()((set, get) => ({
  collapsed: true,
  initialized: false,

  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
  initFromMobile: (isMobile: boolean) => {
    if (!get().initialized) {
      set({ collapsed: isMobile, initialized: true });
    }
  },
}));

// Init the `collapsed` state from mobile.
export function useInitSidebar() {
  const isMobile = useMobile();
  const initFromMobile = useSidebar((s) => s.initFromMobile);

  useEffect(() => {
    initFromMobile(isMobile);
  }, [isMobile, initFromMobile]);
}
