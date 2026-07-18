import { ArrowRightIcon } from "@/components/icons";
import { CopyIcon } from "@mui-verse/ui/components/icons";
import { MenuItem } from "@mui-verse/ui/components/navigation";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { DataItem, DataSeparator } from "./DataList";

export function Help() {
  return (
    <TabMenuPanel value="help">
      <div className="mt-2.25 flex flex-col">
        <DataItem
          label="Contact us"
          value={
            <MenuItem selected>
              support@platovpn.com
              <CopyIcon />
            </MenuItem>
          }
        />
        <DataSeparator />
        <DataItem label="Terms of Service" value={<ArrowRightIcon />} />
        <DataItem
          label="Privacy Policy"
          value={<ArrowRightIcon />}
          className="mt-0.5"
        />
      </div>
    </TabMenuPanel>
  );
}
