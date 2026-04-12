import { BaseSession, createAuthStore } from "@mui-verse/ui/auth";

export interface User extends BaseSession {
  email: string;
}

export const useAuth = createAuthStore<User>({ cookieName: "x-example-verse" });
