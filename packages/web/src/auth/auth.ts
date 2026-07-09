import { BaseSession, createAuthStore } from "@mui-verse/ui/auth";
import { authCookie } from "@mui-verse/ui/server";

export interface UserSession extends BaseSession {
  email: string;
}

export const useAuth = createAuthStore<UserSession>({
  cookieName: "x-anna-auth",
  adapter: authCookie,
});
