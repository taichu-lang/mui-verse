import { ApiResponse } from "@/lib/types/api";
import { Preference, PreferenceResponse } from "@/lib/types/preference";

export async function getPreference(user_id: number): Promise<Preference> {
  const client = await fetch(`/api/users/${user_id}/preference`);
  const response = (await client.json()) as PreferenceResponse;
  return response.data;
}

export async function addPinnedModel(
  user_id: number,
  model: string,
): Promise<boolean> {
  try {
    const client = await fetch(`/api/users/${user_id}/preference`, {
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

export async function unPinModel(
  user_id: number,
  model: string,
): Promise<boolean> {
  try {
    const client = await fetch(`/api/users/${user_id}/preference`, {
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
