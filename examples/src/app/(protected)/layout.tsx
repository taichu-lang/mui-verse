"use client";

import { useAuth } from "@/auth/auth";
import { AuthGuard } from "@mui-verse/ui/auth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard store={useAuth}>{children}</AuthGuard>;
}
