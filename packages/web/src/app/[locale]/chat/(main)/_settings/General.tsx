import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { useTranslations } from "next-intl";

export function General() {
  const t = useTranslations();
  return (
    <TabMenuPanel value="general">
      <div className="flex items-center justify-between">
        <span className="text-sm">{t("settings.general.language")}</span>
        <LanguageSwitch />
      </div>
    </TabMenuPanel>
  );
}
