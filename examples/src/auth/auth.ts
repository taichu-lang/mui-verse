import { BaseSession, createAuthStore } from "@mui-verse/ui/auth";
import { authCookie } from "@mui-verse/ui/server";

export interface User extends BaseSession {
  email: string;
}

export const useAuth = createAuthStore<User>({
  cookieName: "x-example-verse",
  adapter: authCookie,
});
