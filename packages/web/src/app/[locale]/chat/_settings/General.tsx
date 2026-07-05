import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";

export function General() {
  return (
    <TabMenuPanel value="general">
      <div className="mt-2.25 flex items-center justify-between">
        <span className="text-sm">Language</span>
        <LanguageSwitch />
      </div>
    </TabMenuPanel>
  );
}
