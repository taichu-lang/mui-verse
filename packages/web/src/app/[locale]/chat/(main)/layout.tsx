"use client";

import { useBalance } from "@/hooks/useBalance";
import { AnnotationSourceListView } from "@mui-verse/ui/components/chat";
import { useEffect } from "react";
import { AppSidebar } from "./_components/AppSidebar";
import { ChatMain } from "./_components/ChatMain";
import { Navbar } from "./_components/Navbar";
import SettingsDialog from "./_settings/SettingsDialog";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getBalances } = useBalance();

  useEffect(() => {
    getBalances();
  }, [getBalances]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* left */}
      <AppSidebar />

      {/* center */}
      <ChatMain>
        <Navbar />
        {children}
      </ChatMain>

      {/* right */}
      <AnnotationSourceListView width={"358px"} />

      {/* settings dialog */}
      <SettingsDialog />
    </div>
  );
}
