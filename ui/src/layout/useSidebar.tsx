import { create } from "zustand";

interface SidebarState {
  collapsed: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebar = create<SidebarState>()((set) => ({
  collapsed: true,

  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),

  setCollapsed: (collapsed: boolean) => set({ collapsed }),
}));
