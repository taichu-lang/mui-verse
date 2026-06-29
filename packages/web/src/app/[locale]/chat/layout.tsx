import { AppSidebar } from "./AppSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
