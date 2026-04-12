/**
 * Base session interface with required fields
 * Users can extend this to add custom properties
 */
export interface BaseSession {
  token: string;
  expires_at: number; // Unix timestamp in seconds
}
