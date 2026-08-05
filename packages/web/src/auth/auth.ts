"use client";

import { cookieName, UserSession } from "@/auth/session";
import { createAuthStore } from "@mui-verse/ui/auth";
import { authCookie } from "@mui-verse/ui/server";

export const useAuth = createAuthStore<UserSession>({
  cookieName,
  adapter: authCookie,
});

export function getUserName(session: UserSession) {
  if (session.name) {
    return session.name;
  }

  return session.email.split("@")[0];
}
