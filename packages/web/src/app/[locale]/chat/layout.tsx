import { AppSidebar } from "./_components/AppSidebar";
import { Navbar } from "./_components/Navbar";

export default function ChatLayout({
  reference,
  children,
}: {
  reference: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* left */}
      <AppSidebar />

      {/* center */}
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        {children}
      </div>

      {/* right */}
      {reference}
    </div>
  );
}
