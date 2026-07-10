"use client";

import { useAuth } from "./auth";

export function AuthFilter({ children }: { children: React.ReactNode }) {
  const hasAuthorization = useAuth.useHasAuthorization();

  if (hasAuthorization) {
    return children;
  }

  return null;
}
