import { AppSidebar } from "./_components/AppSidebar";
import { ChatMain } from "./_components/ChatMain";
import { ChatSessionProvider } from "./_components/ChatSessionProvider";
import { Navbar } from "./_components/Navbar";
import SettingsDialog from "./_settings/SettingsDialog";

export default function ChatLayout({
  reference,
  children,
}: {
  reference: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <ChatSessionProvider>
        {/* left */}
        <AppSidebar />

        {/* center */}
        <ChatMain>
          <Navbar />
          {children}
        </ChatMain>
      </ChatSessionProvider>

      {/* right */}
      {reference}

      {/* settings dialog */}
      <SettingsDialog />
    </div>
  );
}
