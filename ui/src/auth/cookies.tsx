"use server";

import { logger } from "@mui-verse/ui/utils/logger";
import { cookies } from "next/headers";
import { BaseSession } from "./types";

const COOKIE_NAME = "x-mv-auth-token";

export async function setSessionCookie<T extends BaseSession = BaseSession>(
  session: T,
) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(session);

  const expiresAt = new Date(session.expires_at * 1000);
  cookieStore.set({
    name: COOKIE_NAME,
    value: sessionData,
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionCookie<
  T extends BaseSession = BaseSession,
>(): Promise<T | null> {
  const cookieStore = await cookies();

  // If the cookie has expired, it will be deleted automatically.
  const sessionData = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionData) {
    logger.warn("session is not found from cookie");
    return null;
  }

  const session = JSON.parse(sessionData) as T;
  if (session.expires_at * 1000 < Date.now()) {
    logger.warn({ expired_at: session.expires_at }, "session expired");
    cookieStore.delete(COOKIE_NAME);
    return null;
  }

  return session;
}

export async function removeSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
