export const apiCodeUserNotFound = 2;
export const apiCodeCredentialError = 3;
export const apiCodeSystemError = 99;

export interface ApiResponse {
  code: number;
  message?: string;
}

export type AuthMethod = "otp" | "password" | "google" | "apple";

export interface AuthMethodsResponse extends ApiResponse {
  data: AuthMethod[];
}
