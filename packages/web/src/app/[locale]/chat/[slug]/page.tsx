import { Loading } from "@mui-verse/ui/components/effects";
import { Suspense } from "react";
import { ChatPage } from "../_components/ChatPage";
import { fetchMessagesPage, getConversation } from "../_components/lib";

async function PageContent({ id }: { id: string }) {
  const [messages, conversation] = await Promise.all([
    fetchMessagesPage(id),
    getConversation(id),
  ]);
  if (!messages) {
    return null;
  }

  return (
    <ChatPage
      initialMessages={messages}
      initialConversation={conversation ?? undefined}
    />
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <PageContent id={slug} />
    </Suspense>
  );
}
