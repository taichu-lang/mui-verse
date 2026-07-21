import { ApiResponse, AuthMethod } from "./api";
import { Balance, PlanCode } from "./benefit";

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

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  auth: AuthToken;
  plan_code: PlanCode;
  balances: Balance[];
}

export interface UserProfileResponse extends ApiResponse {
  data: UserProfile;
}

export interface UpdateProfileRequest {
  name?: string;
}
