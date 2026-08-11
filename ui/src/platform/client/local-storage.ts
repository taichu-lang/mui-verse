import { AuthStorageAdapter, BaseSession } from "@mui-verse/ui/auth";

// TODO(Leo): using keyring instead.
export const localSession: AuthStorageAdapter = {
  load: async <T extends BaseSession>(key: string): Promise<T | null> => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }

    return null;
  },

  store: async <T extends BaseSession>(
    key: string,
    session: T,
  ): Promise<void> => {
    localStorage.setItem(key, JSON.stringify(session));
  },

  remove: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
  },
};
