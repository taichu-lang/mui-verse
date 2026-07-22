"server-only";

import { cookieName, UserSession } from "@/auth/session";
import { cookies, headers } from "next/headers";
import { logger } from "./logger";

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

export const getDomain = async (): Promise<string> => {
  const hs = await headers();
  const forwarded = hs.get("x-forwarded-host");
  if (forwarded) {
    return forwarded;
  }

  logger.debug(
    "x-forwarded-host is not found in the header, fallback to host.",
  );

  const domain = hs.get("host");
  return domain || "";
};
