import { BaseSession, createAuthStore } from "@mui-verse/ui/auth";
import { authCookie } from "./cookie-adapter";

/**
 * Default auth store instance
 * For most apps, you can use this directly
 * For custom session types, create your own store with createAuthStore<T>()
 */
export const useAuth = createAuthStore<BaseSession>({ adapter: authCookie });
