"use client";

import { logger } from "@mui-verse/ui/utils/logger";
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  noopAdapter,
  type AuthStorageAdapter,
  type BaseSession,
} from "./types";

// SSR-safe "have we mounted on the client yet" — returns false on the server
// and on the client's first render, then true after commit. We can't use the
// store's `hasHydrated` flag: zustand's persist middleware sets it
// synchronously at module load, so it's already true on the client's first
// render while server rendered with false, which is exactly the mismatch we're
// trying to avoid. `useSyncExternalStore` is the idiomatic React 18+ tool for
// this — its third arg is the server snapshot.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;
function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const SESSION_SYNC_KEY = "__mv_session_sync_event__";
const DEFAULT_COOKIE_NAME = "x-verse-auth-token";

interface AuthState<T extends BaseSession = BaseSession> {
  session: T | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
}

interface AuthActions<T extends BaseSession = BaseSession> {
  setSession: (session: T) => Promise<void>;
  updateSession: (session: Partial<T>) => Promise<void>;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
  _initializeCrossTabSync: () => () => void;
}

export type AuthStore<T extends BaseSession = BaseSession> = AuthState<T> &
  AuthActions<T>;

export function createAuthStore<T extends BaseSession = BaseSession>({
  storeName = "auth",
  cookieName = DEFAULT_COOKIE_NAME,
  adapter = noopAdapter,
}: {
  storeName?: string;
  cookieName?: string;
  adapter?: AuthStorageAdapter;
}) {
  const useStore = create<AuthStore<T>>()(
    devtools(
      persist(
        (set, get) => ({
          session: null,
          isLoading: true,
          error: null,
          hasHydrated: false,

          setSession: async (session) => {
            set({ session, error: null });
            await adapter.store<T>(cookieName, session);

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

          updateSession: async (session) => {
            const newSession = {
              ...get().session!,
              ...session,
            };

            set({ session: newSession, error: null });
            await adapter.store<T>(cookieName, newSession);

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
              const session = await adapter.load<T>(cookieName);
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
            await adapter.remove(cookieName);

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
            session: state.session,
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

  // SSR-safe wrappers: return the server-side value (null / false) until the
  // client has mounted, so the first render on both sides matches. Callers
  // should prefer these over reading `session` / calling `hasAuthorization()`
  // directly whenever the value drives the JSX tree structure.
  //
  // Note: we intentionally do NOT check `expires_at` here — reading `Date.now()`
  // during render is impure and re-introduces the same class of mismatch we
  // just fixed. Expiration is handled elsewhere: (1) the cookie adapter drops
  // expired sessions on load, (2) API 401s trigger `logout()`, which clears
  // the session and re-renders these hooks to `null` / `false`. For
  // imperative right-now checks (e.g. before firing a request), call the
  // store's `hasAuthorization()` method — it's a function, not a hook, and
  // reading time there is fine.
  function useSession(): T | null {
    const mounted = useMounted();
    const session = useStore((s) => s.session);
    return mounted ? session : null;
  }

  function useHasAuthorization(): boolean {
    return useSession() != null;
  }

  return Object.assign(useStore, { useSession, useHasAuthorization });
}
