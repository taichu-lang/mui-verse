import { useAuth } from "@/auth/auth";
import {
  apiCodeUserNotFound,
  AuthMethod,
  AuthMethodsResponse,
} from "@/lib/types/api";
import { SigninRequest, UserProfileResponse } from "@/lib/types/sign";

export async function getAuthMethods(
  email: string,
  onUserNotFound: () => void,
): Promise<AuthMethod[]> {
  try {
    const client = await fetch(`/api/users/methods?email=${email}`, {
      method: "GET",
    });
    const response = (await client.json()) as AuthMethodsResponse;
    if (response.code === apiCodeUserNotFound) {
      onUserNotFound();
      return [];
    }

    if (response.code !== 0) {
      console.log(`code: ${response.code}, message: ${response.message}`);
      return [];
    }

    return response.data;
  } catch (err) {
    console.log(err);
  }

  return [];
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
    const { email, auth } = response.data;
    setSession({
      email,
      token: auth.token,
      expires_at: auth.expires_in * 1000 + Date.now(),
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
    const { email, auth } = response.data;
    setSession({
      email,
      token: auth.token,
      expires_at: auth.expires_in * 1000 + Date.now(),
    });
  }

  return response;
}
