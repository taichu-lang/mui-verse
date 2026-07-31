"use client";

import { usePathname } from "@/i18n/navigation";
import { genConversationID } from "@/lib/uuid";
import { useSearchParams } from "next/navigation";

export function useSettingsLink() {
  const pathname = usePathname();
  const search = useSearchParams();

  const navigateLink = (panel: string) => {
    const inChatPage = pathname.startsWith("/chat");
    if (inChatPage) {
      const params = new URLSearchParams(search);
      params.set("modal", panel);
      return `${pathname}?${params}`;
    }

    const id = genConversationID();
    const params = new URLSearchParams();
    params.set("modal", panel);
    params.set("n", "1"); // newly conversation.
    return `/chat/${id}?${params}`;
  };

  const backLink = () => {
    const params = new URLSearchParams(search);
    params.delete("modal");
    return `${pathname}?${params}`;
  };

  return { navigateLink, backLink };
}
