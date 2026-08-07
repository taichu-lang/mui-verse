import { useAuth } from "@/auth/auth";
import { UserSession } from "@/auth/session";
import { ApiResponse } from "@/lib/types/api";
import {
  AuthMethodsResponse,
  SigninRequest,
  SignResponse,
  UpdateProfileRequest,
  UserProfileResponse,
} from "@/lib/types/profile";

export async function getAuthMethods(
  email: string,
): Promise<AuthMethodsResponse> {
  const client = await fetch(`/api/users/methods?email=${email}`, {
    method: "GET",
  });
  const response = (await client.json()) as AuthMethodsResponse;
  return response;
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  const client = await fetch(`/api/users/profile`, {
    method: "GET",
  });
  const response = (await client.json()) as UserProfileResponse;
  if (response.code === 0) {
    const profile = response.data;
    const { setSession } = useAuth.getState();
    await setSession({
      ...profile,
      token: profile.auth.token,
      expires_at: profile.auth.expires_in + Date.now() / 1000,
    });
  }

  return response;
}

async function sign(request: SigninRequest): Promise<number> {
  const { setSession, logout } = useAuth.getState();
  const client = await fetch("/api/users/signin", {
    method: "POST",
    body: JSON.stringify(request),
  });
  const response = (await client.json()) as SignResponse;
  if (response.code !== 0) {
    return response.code;
  }

  const user = response.data;

  // set default value, then sync user's profile.
  const session: UserSession = {
    ...user,
    auth_methods: [],
    subscription: {
      plan_code: "free",
      started_at: 0,
      expires_at: 0,
    },
    token: user.auth.token,
    expires_at: user.auth.expires_in + Date.now() / 1000,
  };
  await setSession(session);

  const profileResponse = await getUserProfile();
  if (profileResponse.code !== 0) {
    await logout();
    return profileResponse.code;
  }

  return 0;
}

// returns api code.
export async function signinWithCode(
  email: string,
  code: string,
): Promise<number> {
  const request: SigninRequest = {
    email,
    method: "otp",
    credential: { code },
  };

  return await sign(request);
}

export async function signinWithPassword(
  email: string,
  password: string,
): Promise<number> {
  const request: SigninRequest = {
    email,
    method: "password",
    credential: { password },
  };

  return await sign(request);
}

export async function updateUser(
  request: UpdateProfileRequest,
): Promise<boolean> {
  if (!request.name) {
    throw new Error("invalid parameters.");
  }

  const { updateSession } = useAuth.getState();
  const client = await fetch("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify(request),
  });
  const response = (await client.json()) as ApiResponse;
  if (response.code === 0) {
    if (request.name) {
      updateSession({ name: request.name });
    }

    return true;
  }

  return false;
}

export async function updatePassword(
  password: string,
  token: string,
): Promise<boolean> {
  const client = await fetch(`/api/users/password`, {
    method: "POST",
    body: JSON.stringify({ password }),
    headers: { "x-token": token },
  });

  const response = (await client.json()) as ApiResponse;
  if (response.code === 0) {
    return true;
  }

  return false;
}
