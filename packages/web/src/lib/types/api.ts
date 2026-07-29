// Some api needs the locale information in the server side (i.e., node.js).
// However we can not get the locale using `getLocale()` provided by
// 'next-intl/server' in api router, as `/api` has been excluded in `proxy.ts`,
// which means that switch locale from client side can not sync to intl server.
// Use the following header to sync locale to the server side.
export const LOCALE_HEADER = "x-api-locale";

export const apiCodeInputError = 1;
export const apiCodeUserNotFound = 2;
export const apiCodeCredentialError = 3;
export const apiCodeForbidden = 4;
export const apiCodeSystemError = 99;

export interface ApiResponse {
  code: number;
  message?: string;
}

export type AuthMethod = "otp" | "password" | "google" | "apple";

export interface AuthMethodsResponse extends ApiResponse {
  data: AuthMethod[];
}
