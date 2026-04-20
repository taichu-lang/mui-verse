/**
 * Base session interface with required fields
 * Users can extend this to add custom properties
 */
export interface BaseSession {
  token: string;
  expires_at: number; // Unix timestamp in seconds
}

/**
 * Pluggable storage adapter for session persistence.
 */
export interface AuthStorageAdapter {
  load<T extends BaseSession>(key: string): Promise<T | null>;
  store<T extends BaseSession>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export const noopAdapter: AuthStorageAdapter = {
  load: async () => null,
  store: async () => {},
  remove: async () => {},
};
