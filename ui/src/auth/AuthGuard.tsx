"use client";

import { Loading } from "@mui-verse/ui/components/effects";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useAuth, type AuthStore, type createAuthStore } from "./store";
import type { BaseSession } from "./types";
import { useLocale } from "next-intl";

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
  const locale = useLocale();

  const authStore = store() as AuthStore<T>;
  const {
    isLoading,
    hasHydrated,
    hasAuthorization,
    loadSession,
    _initializeCrossTabSync,
  } = authStore;
  const initializedRef = useRef(false);

  // Initialize session from cookie and setup cross-tab sync (once on mount)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    loadSession();

    // Setup cross-tab synchronization
    const unsubscribe = _initializeCrossTabSync();

    return unsubscribe;
  }, [loadSession, _initializeCrossTabSync]);

  const pathname = usePathname();
  const router = useRouter();
  const redirectTo = `/${locale}${redirectUrl}?redirect_uri=${encodeURIComponent(pathname)}`;

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
