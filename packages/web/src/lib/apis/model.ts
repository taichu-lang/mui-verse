import { Model, models } from "@/lib/types/model";
import { getPreference } from "./preference";

export async function getModels(user_id?: number): Promise<Model[]> {
  let pinned: string[] = [];
  if (user_id) {
    try {
      const preference = await getPreference(user_id);
      pinned = preference.pinned_models;
    } catch {}
  }

  if (!pinned) {
    return models;
  }

  const pinIdxMap = new Map<string, number>();
  pinned.forEach((id, index) => pinIdxMap.set(id, index));

  return models
    .map((model) => {
      if (pinIdxMap.has(model.id)) {
        return { ...model, pinned: true };
      }

      return model;
    })
    .sort((l, r) => {
      const leftIdx = pinIdxMap.get(l.id);
      const rightIdx = pinIdxMap.get(r.id);
      const hasLeft = leftIdx !== undefined;
      const hasRight = rightIdx !== undefined;

      if (hasLeft && !hasRight) return -1;
      if (!hasLeft && hasRight) return 1;

      return 0;
    });
}
