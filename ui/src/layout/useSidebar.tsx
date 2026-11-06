import { useMobile } from "@mui-verse/ui/hooks/useMobile";
import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
  /** Whether the sidebar is collapsed right now. */
  collapsed: boolean;
  /** The persisted preference `collapsed` falls back to. */
  preference: boolean;
  initialized: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  /** Collapse for the current view only, leaving the preference untouched. */
  collapseTemporarily: () => void;
  /** Drop a temporary collapse and go back to the preference. */
  restorePreference: () => void;
  initFromMobile: (isMobile: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set, get) => ({
      collapsed: true,
      preference: true,
      initialized: false,

      toggleCollapsed: () =>
        set((state) => {
          const collapsed = !state.collapsed;
          return { collapsed, preference: collapsed };
        }),
      setCollapsed: (collapsed: boolean) =>
        set({ collapsed, preference: collapsed }),
      collapseTemporarily: () => set({ collapsed: true }),
      restorePreference: () =>
        set((state) => ({ collapsed: state.preference })),
      initFromMobile: (isMobile: boolean) => {
        if (!get().initialized) {
          set({ collapsed: isMobile, preference: isMobile, initialized: true });
        }
      },
    }),
    {
      name: "mvs-sidebar-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preference: state.preference,
        initialized: state.initialized,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<SidebarState> | undefined;
        // `collapsed` is the pre-`preference` key, kept as a fallback.
        const preference =
          saved?.preference ?? saved?.collapsed ?? current.preference;
        return { ...current, ...saved, preference, collapsed: preference };
      },
    },
  ),
);

// Init the `collapsed` state from mobile.
export function useInitSidebar() {
  const isMobile = useMobile();
  const initFromMobile = useSidebar((s) => s.initFromMobile);

  useEffect(() => {
    initFromMobile(isMobile);
  }, [isMobile, initFromMobile]);
}
