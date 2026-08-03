import { Loading } from "@mui-verse/ui/components/effects";
import { Suspense } from "react";
import { ChatPage } from "../_components/ChatPage";
import { fetchMessagesPage, getConversation } from "../_components/lib";

async function PageContent({ id, newly }: { id: string; newly: boolean }) {
  const [messages, conversation] = newly
    ? [
        { messages: [], has_more: false },
        { id: 0, conversation_id: id, title: "", pinned: false },
      ]
    : await Promise.all([fetchMessagesPage(id), getConversation(id)]);

  if (!messages || !conversation) {
    return null;
  }

  return (
    <ChatPage initialMessages={messages} initialConversation={conversation} />
  );
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ n?: string }>;
}) {
  const { slug } = await params;
  const { n } = await searchParams;

  return (
    <Suspense fallback={<Loading />}>
      <PageContent id={slug} newly={n === "1"} />
    </Suspense>
  );
}
