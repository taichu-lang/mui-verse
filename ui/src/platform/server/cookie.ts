"use server";

import type { BaseSession } from "@mui-verse/ui/auth";
import { logger } from "@mui-verse/ui/utils/logger";
import { cookies } from "next/headers";

export async function loadSessionFromCookie<T extends BaseSession>(
  key: string,
): Promise<T | null> {
  const cookieStore = await cookies();

  const sessionData = cookieStore.get(key)?.value;
  if (!sessionData) {
    logger.warn("session is not found from cookie");
    return null;
  }

  const session = JSON.parse(sessionData) as T;
  if (session.expires_at * 1000 < Date.now()) {
    logger.warn({ expired_at: session.expires_at }, "session expired");
    cookieStore.delete(key);
    return null;
  }

  return session;
}

export async function storeSessionToCookie<T extends BaseSession>(
  key: string,
  session: T,
): Promise<void> {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(session);

  const expiresAt = new Date(session.expires_at * 1000);
  cookieStore.set({
    name: key,
    value: sessionData,
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export async function removeSessionFromCookie(key: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}
