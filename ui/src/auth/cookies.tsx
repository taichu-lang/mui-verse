"use server";

import { logger } from "@mui-verse/ui/utils/logger";
import { cookies } from "next/headers";
import { BaseSession } from "./types";

export async function setSessionCookie<T extends BaseSession = BaseSession>(
  session: T,
  cookie_name: string,
) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(session);

  const expiresAt = new Date(session.expires_at * 1000);
  cookieStore.set({
    name: cookie_name,
    value: sessionData,
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionCookie<T extends BaseSession = BaseSession>(
  cookie_name: string,
): Promise<T | null> {
  const cookieStore = await cookies();

  // If the cookie has expired, it will be deleted automatically.
  const sessionData = cookieStore.get(cookie_name)?.value;
  if (!sessionData) {
    logger.warn("session is not found from cookie");
    return null;
  }

  const session = JSON.parse(sessionData) as T;
  if (session.expires_at * 1000 < Date.now()) {
    logger.warn({ expired_at: session.expires_at }, "session expired");
    cookieStore.delete(cookie_name);
    return null;
  }

  return session;
}

export async function removeSessionCookie(cookie_name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(cookie_name);
}
