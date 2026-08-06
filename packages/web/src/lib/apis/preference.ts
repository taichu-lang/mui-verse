import { ApiResponse } from "@/lib/types/api";
import { Preference, PreferenceResponse } from "@/lib/types/preference";

export async function getPreference(): Promise<Preference> {
  const client = await fetch("/api/users/preference");
  const response = (await client.json()) as PreferenceResponse;
  return response.data;
}

export async function addPinnedModel(model: string): Promise<boolean> {
  try {
    const client = await fetch("/api/users/preference", {
      method: "POST",
      body: JSON.stringify({
        pinned_model: model,
      }),
    });
    const response = (await client.json()) as ApiResponse;
    return response.code === 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function unPinModel(model: string): Promise<boolean> {
  try {
    const client = await fetch("/api/users/preference", {
      method: "DELETE",
      body: JSON.stringify({
        pinned_model: model,
      }),
    });
    const response = (await client.json()) as ApiResponse;
    return response.code === 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}
