"use client";

import { useConversation } from "@/hooks/useConversation";

export function Navbar() {
  const { conversation } = useConversation();

  return (
    <div className="h-navbar z-navbar sticky top-0 flex w-full shrink-0 items-center bg-white/80 backdrop-blur">
      <span className="mr-2.5 ml-5 text-base font-medium">
        {conversation?.title}
      </span>
    </div>
  );
}
