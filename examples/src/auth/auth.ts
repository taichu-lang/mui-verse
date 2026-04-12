import { BaseSession, createAuthStore } from "@mui-verse/ui/auth";

export interface User extends BaseSession {
  email: string;
}

export const useAuth = createAuthStore({ cookieName: "x-example-verse" });
