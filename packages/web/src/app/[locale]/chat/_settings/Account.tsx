import { useAuth } from "@/auth/auth";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { DataItem, DataSeparator } from "./DataList";
import { Button } from "@/components/ui/Button";

export function Account() {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  return (
    <TabMenuPanel value="account">
      <DataItem label="Name" value={session.name} />
      <DataSeparator />
      <DataItem label="Email" value={session.email} />
      <DataSeparator />
      <DataItem
        label="Plan: Pro"
        value={<Button className="h-6 px-2.5 py-1 text-xs">Adjust plan</Button>}
      />
    </TabMenuPanel>
  );
}
