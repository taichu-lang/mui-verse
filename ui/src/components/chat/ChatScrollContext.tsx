"use client";

import { createContext, useContext } from "react";

export const ChatScrollContainerContext = createContext<HTMLElement | null>(null);

export function useChatScrollContainer() {
  return useContext(ChatScrollContainerContext);
}
