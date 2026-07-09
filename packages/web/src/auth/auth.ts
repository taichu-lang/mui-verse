import { UserProfile } from "@/lib/types/profile";
import { BaseSession, createAuthStore } from "@mui-verse/ui/auth";
import { authCookie } from "@mui-verse/ui/server";

export const cookieName = "x-anna-auth";

export type UserSession = BaseSession & Omit<UserProfile, "auth">;

export const useAuth = createAuthStore<UserSession>({
  cookieName,
  adapter: authCookie,
});
