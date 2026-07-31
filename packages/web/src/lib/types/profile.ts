import { ApiResponse } from "./api";
import { PlanCode, PlanDuration } from "./enums";

export type AuthMethod = "otp" | "password" | "google" | "apple";

export interface AuthMethodsResponse extends ApiResponse {
  data: AuthMethod[];
}

export interface OtpCredential {
  code: string;
}

export interface PasswordCredential {
  password: string;
}

export interface SigninRequest {
  email: string;
  method: AuthMethod;
  credential: OtpCredential | PasswordCredential;
}

export interface AuthToken {
  token: string;
  expires_in: number;
}

export interface Subscription {
  plan_code: PlanCode;
  period?: PlanDuration;
  period_start: number;
  period_end: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  auth: AuthToken;
  auth_methods: AuthMethod[];
  subscription: Subscription;
}

export interface UserProfileResponse extends ApiResponse {
  data: UserProfile;
}

export interface UpdateProfileRequest {
  name?: string;
}
