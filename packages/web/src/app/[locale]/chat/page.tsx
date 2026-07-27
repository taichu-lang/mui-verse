"use client";

import { useAuth } from "@/auth/auth";
import { genConversationID } from "@/lib/uuid";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { DefaultChatPage } from "./_components/ChatPage";

export default function Page() {
  const { session } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (session) {
        const id = genConversationID();
        router.replace(`/chat/${id}?n=1`);
      }
    });
  }, [session, router]);

  if (isPending) {
    return null;
  }

  return <DefaultChatPage />;
}
