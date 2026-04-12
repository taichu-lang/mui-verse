"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useAuth, type AuthStore } from "./store";
import type { BaseSession } from "./types";

export interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectUrl?: string;
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
export function AuthGuard({
  children,
  fallback = <div>Loading...</div>,
  redirectUrl = "/login",
}: AuthGuardProps) {
  const { isLoading, hasHydrated, hasAuthorization } =
    useAuth() as AuthStore<BaseSession>;
  const initializedRef = useRef(false);

  // Initialize session from cookie and setup cross-tab sync (once on mount)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const { loadSession, _initializeCrossTabSync } =
      useAuth.getState() as AuthStore<BaseSession>;
    loadSession();

    // Setup cross-tab synchronization
    const unsubscribe = _initializeCrossTabSync();

    return unsubscribe;
  }, []);

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
