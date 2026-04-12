"use client";

import { Loading } from "@mui-verse/ui/components/effects";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useAuth, type AuthStore, type createAuthStore } from "./store";
import type { BaseSession } from "./types";

export interface AuthGuardProps<T extends BaseSession = BaseSession> {
  children: ReactNode;
  fallback?: ReactNode;
  redirectUrl?: string;
  store?: ReturnType<typeof createAuthStore<T>>;
}

/**
 * AuthGuard component - wraps content that requires authentication
 * Handles loading state, session validation, and redirects on logout
 *
 * @example
 * <AuthGuard fallback={<LoadingSpinner />}>
 *   <Dashboard />
 * </AuthGuard>
 */
export function AuthGuard<T extends BaseSession = BaseSession>({
  children,
  redirectUrl = "/login",
  store = useAuth as ReturnType<typeof createAuthStore<T>>,
  fallback = <Loading />,
}: AuthGuardProps<T>) {
  const { isLoading, hasHydrated, hasAuthorization } = store() as AuthStore<T>;
  const initializedRef = useRef(false);

  // Initialize session from cookie and setup cross-tab sync (once on mount)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const { loadSession, _initializeCrossTabSync } =
      store.getState() as AuthStore<T>;
    loadSession();

    // Setup cross-tab synchronization
    const unsubscribe = _initializeCrossTabSync();

    return unsubscribe;
  }, [store]);

  const pathname = usePathname();
  const router = useRouter();
  const redirectTo = `${redirectUrl}?redirect_uri=${encodeURIComponent(pathname)}`;

  // Handle unauthenticated state
  useEffect(() => {
    if (isLoading || !hasHydrated) return;

    if (!hasAuthorization()) {
      router.replace(redirectTo);
    }
  }, [hasAuthorization, isLoading, hasHydrated, router, redirectTo]);

  // Loading state
  if (isLoading) {
    return fallback;
  }

  // Not authenticated
  if (!hasAuthorization()) {
    return fallback;
  }

  // Authenticated
  return children;
}
