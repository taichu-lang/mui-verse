import { ChevronRightIcon } from "@/components/icons";
import { ClipboardButton } from "@mui-verse/ui/components/buttons";
import { MenuItem } from "@mui-verse/ui/components/navigation";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { copyToClipboard } from "@mui-verse/ui/utils/clipboard";
import { useTranslations } from "next-intl";
import { DataItem, DataSeparator } from "./DataList";

const email = "support@platovpn.com";

export function Help() {
  const t = useTranslations();

  return (
    <TabMenuPanel value="help">
      <div className="flex flex-col">
        <DataItem label={t("footer.contact")}>
          <MenuItem selected>
            {email}
            <ClipboardButton
              onClick={() => copyToClipboard(email)}
              variant="ghost"
            />
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
