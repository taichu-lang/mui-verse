import { logger } from "@mui-verse/ui/utils/logger";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  getSessionCookie,
  removeSessionCookie,
  setSessionCookie,
} from "./cookies";
import type { BaseSession } from "./types";

const SESSION_SYNC_KEY = "__mv_session_sync_event__";

interface AuthState<T extends BaseSession = BaseSession> {
  session: T | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
}

interface AuthActions<T extends BaseSession = BaseSession> {
  setSession: (session: T) => Promise<void>;

  loadSession: () => Promise<void>;

  logout: () => Promise<void>;

  hasAuthorization: () => boolean;

  _initializeCrossTabSync: () => () => void;
}

export type AuthStore<T extends BaseSession = BaseSession> = AuthState<T> &
  AuthActions<T>;

export function createAuthStore<T extends BaseSession = BaseSession>(
  storeName: string = "auth",
) {
  return create<AuthStore<T>>()(
    devtools(
      persist(
        (set, get) => ({
          session: null,
          isLoading: true,
          error: null,
          hasHydrated: false,

          setSession: async (session) => {
            set({ session, error: null });
            await setSessionCookie(session);

            // Notify other tabs about the session change.
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(
                SESSION_SYNC_KEY,
                JSON.stringify({
                  session,
                  timestamp: Date.now(),
                }),
              );
            }
          },

          loadSession: async () => {
            set({ isLoading: true });
            try {
              const session = await getSessionCookie<T>();
              if (session) {
                set({ session, isLoading: false });
              } else {
                set({ session: null, isLoading: false });
              }
            } catch (error) {
              console.error("Failed to load session:", error);
              logger.error({ err: error }, "failed to load session");
              set({
                session: null,
                error: "Failed to load session",
                isLoading: false,
              });
            }
          },

          logout: async () => {
            set({ session: null, error: null });
            await removeSessionCookie();

            // Notify other tabs about the session change.
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(
                SESSION_SYNC_KEY,
                JSON.stringify({
                  session: null,
                  timestamp: Date.now(),
                }),
              );
            }
          },

          hasAuthorization: () => {
            const { session } = get();
            console.log(">>> session: ", session);

            if (!session) {
              return false;
            }

            const isExpired = session.expires_at * 1000 < Date.now();
            return !isExpired;
          },

          _initializeCrossTabSync: () => {
            if (typeof window === "undefined") return () => {};

            const handleStorageChange = (event: StorageEvent) => {
              if (event.key === SESSION_SYNC_KEY && event.newValue) {
                try {
                  const { session } = JSON.parse(event.newValue);
                  set({ session });
                } catch (error) {
                  console.error("Failed to parse session sync:", error);
                }
              }
            };

            window.addEventListener("storage", handleStorageChange);

            return () => {
              window.removeEventListener("storage", handleStorageChange);
            };
          },
        }),
        {
          name: storeName,
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({
            // session will be loaded from cookie or server action.
            error: state.error,
          }),
          onRehydrateStorage: () => (state) => {
            if (state) {
              state.hasHydrated = true;
            }
          },
        },
      ),
    ),
  );
}

/**
 * Default auth store instance
 * For most apps, you can use this directly
 * For custom session types, create your own store with createAuthStore<T>()
 */
export const useAuth = createAuthStore<BaseSession>();
