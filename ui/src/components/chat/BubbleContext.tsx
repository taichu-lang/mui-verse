import { createContext, useContext } from "react";
import { Message } from "./types";

const BubbleContext = createContext<Message | null>(null);

export function useBubble() {
  const ctx = useContext(BubbleContext);
  if (!ctx) {
    throw new Error("useBubble must be used within a BubbleContextProvider");
  }

  return ctx;
}

// Use BubbleContextProvider to share message between Bubble and BubbleActions.
export function BubbleContextProvider({
  message,
  children,
}: {
  message: Message;
  children: React.ReactNode;
}) {
  return (
    <BubbleContext.Provider value={message}>{children}</BubbleContext.Provider>
  );
}
