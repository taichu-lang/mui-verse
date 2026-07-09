import { ApiResponse, AuthMethod } from "./api";

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
  email: string;
  auth: AuthToken;
}

export interface UserProfileResponse extends ApiResponse {
  data: UserProfile;
}
