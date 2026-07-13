import { Loading } from "@mui-verse/ui/components/effects";
import { Suspense } from "react";
import { ChatPage } from "../_components/ChatPage";
import { fetchMessagesPage } from "../_components/lib";

async function PageContent({ id }: { id: string }) {
  const initial = await fetchMessagesPage(id);
  if (!initial) {
    return null;
  }

  return <ChatPage initial={initial ?? undefined} />;
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
