"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Shared, cross-conversation chat preferences.
 *
 * Design goals
 * ------------
 * Scope: values here follow the user, not any single conversation. Model
 * selection and the web-search toggle apply to the next send regardless of
 * which conversation the user is in, and they outlive navigation between
 * conversations or a return to `/chat`.
 *
 * Lifetime: a module-level zustand store. No Provider, no per-route lifecycle.
 * Created once when this module is first imported and lives for the tab.
 * Reads and writes are stable across pathname changes — nothing about
 * switching conversations touches this store.
 *
 * Persistence: `persist` writes to localStorage under `chat.prefs`. A hard
 * reload restores the last model and web-search choice; only `model` is
 * persisted (see `partialize`), functions and any future runtime-only fields
 * are re-initialized from the creator.
 *
 * Not for connection-scoped state: anything describing the currently-open
 * conversation's message stream — loaded messages, streaming flags,
 * pagination cursor, in-flight bookkeeping — belongs in `useChatSession`,
 * which is intentionally torn down and rebuilt whenever the user opens a
 * different conversation. See `ChatSessionContext.tsx` for that side.
 */
interface ChatState {
  model: string;
}

export interface ChatValue extends ChatState {
  setChat: (patch: Partial<ChatState>) => void;
}

export const useChat = create<ChatValue>()(
  persist(
    (set) => ({
      model: "",
      setChat: (patch) => set(patch),
    }),
    {
      name: "x-chat-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        model: state.model,
      }),
    },
  ),
);
