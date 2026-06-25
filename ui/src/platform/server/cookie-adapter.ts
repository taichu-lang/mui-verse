import type { AuthStorageAdapter } from "@mui-verse/ui/auth";
import {
  loadSessionFromCookie,
  removeSessionFromCookie,
  storeSessionToCookie,
} from "./cookie";

export const authCookie: AuthStorageAdapter = {
  load: loadSessionFromCookie,
  store: storeSessionToCookie,
  remove: removeSessionFromCookie,
};
