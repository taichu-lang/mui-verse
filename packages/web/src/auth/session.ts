import { UserProfile } from "@/lib/types/profile";
import { BaseSession } from "@mui-verse/ui/auth";

// Note that this field will be used in the server component, it can not be
// defined in `auth.ts`, as fields will be serialized to the server, then the
// value is not `x-anna-auth` in the server anymore.
export const cookieName = "x-anna-auth";

export type UserSession = BaseSession & Omit<UserProfile, "auth">;
