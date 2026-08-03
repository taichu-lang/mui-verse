import { ChevronRightIcon } from "@/components/icons";
import { CopyIcon } from "@mui-verse/ui/components/icons";
import { MenuItem } from "@mui-verse/ui/components/navigation";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { DataItem, DataSeparator } from "./DataList";
import { useTranslations } from "next-intl";

export function Help() {
  const t = useTranslations();

  return (
    <TabMenuPanel value="help">
      <div className="flex flex-col">
        <DataItem label={t("footer.contact")}>
          <MenuItem selected>
            support@platovpn.com
            <CopyIcon />
          </MenuItem>
        </DataItem>
        <DataSeparator />
        <DataItem label={t("footer.tos")}>
          <ChevronRightIcon className="h-4.5 w-4.5" />
        </DataItem>
        <DataItem label={t("footer.privacy")} className="mt-0.5">
          <ChevronRightIcon className="h-4.5 w-4.5" />
        </DataItem>
      </div>
    </TabMenuPanel>
  );
}
