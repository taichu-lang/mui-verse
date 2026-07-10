"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./auth";

export function AuthZone({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAuth((s) => s.hasHydrated);
  const hasAuthorization = useAuth((s) => s.hasAuthorization);
  const router = useRouter();

  if (hasHydrated && hasAuthorization()) {
    return children;
  }

  return (
    <div className="relative">
      <div
        className="z-navbar absolute inset-0 cursor-pointer bg-transparent"
        role="button"
        tabIndex={0}
        onClick={() => router.push("/signin")}
      />
      {children}
    </div>
  );
}
