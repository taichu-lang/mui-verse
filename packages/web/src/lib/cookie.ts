"server-only";

import { cookieName, UserSession } from "@/auth/session";
import { cookies } from "next/headers";

export async function getAuthSession(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const data = cookieStore.get(cookieName)?.value;
  if (data) {
    const session = JSON.parse(data) as UserSession;
    return {
      Authorization: `Bearer ${session.token}`,
    };
  }

  return {};
}
