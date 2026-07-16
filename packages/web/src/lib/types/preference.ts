import { ApiResponse } from "./api";

export interface Preference {
  user_id: number;
  pinned_models: string[];
}

export interface PreferenceResponse extends ApiResponse {
  data: Preference;
}
