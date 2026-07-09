import { useAuth } from "@/auth/auth";
import { ApiResponse, AuthMethodsResponse } from "@/lib/types/api";
import {
  SigninRequest,
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

export async function signinWithCode(
  email: string,
  code: string,
): Promise<UserProfileResponse> {
  const { setSession } = useAuth.getState();

  const request: SigninRequest = {
    email,
    method: "otp",
    credential: { code },
  };

  const client = await fetch(`/api/users/signin`, {
    method: "POST",
    body: JSON.stringify(request),
  });
  const response = (await client.json()) as UserProfileResponse;
  if (response.code === 0) {
    const profile = response.data;
    setSession({
      ...profile,
      token: profile.auth.token,
      expires_at: profile.auth.expires_in * 1000 + Date.now(),
    });
  }

  return response;
}

export async function signinWithPassword(
  email: string,
  password: string,
): Promise<UserProfileResponse> {
  const { setSession } = useAuth.getState();
  const request: SigninRequest = {
    email,
    method: "password",
    credential: { password },
  };

  const client = await fetch(`/api/users/signin`, {
    method: "POST",
    body: JSON.stringify(request),
  });
  const response = (await client.json()) as UserProfileResponse;
  if (response.code === 0) {
    const profile = response.data;
    setSession({
      ...profile,
      token: profile.auth.token,
      expires_at: profile.auth.expires_in * 1000 + Date.now(),
    });
  }

  return response;
}

export async function updateUser(
  user_id: number,
  request: UpdateProfileRequest,
): Promise<boolean> {
  if (!request.name && !request.password) {
    throw new Error("invalid parameters.");
  }

  const { updateSession } = useAuth.getState();

  const client = await fetch(`/api/users/${user_id}`, {
    method: "POST",
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
