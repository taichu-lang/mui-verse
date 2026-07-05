import { AuthFilter } from "@/auth/AuthFilter";
import { DataItem, DataSeparator } from "./DataList";
import { Button } from "@mui/material";

export function Account() {
  return (
    <AuthFilter>
      <DataItem label="Name" value={"Someone"} />
      <DataSeparator />
      <DataItem label="Email" value={"Someone@gmail.com"} />
      <DataSeparator />
      <DataItem
        label="Plan: Pro"
        value={<Button className="h-6 text-xs">Adjust plane</Button>}
      />
    </AuthFilter>
  );
}
