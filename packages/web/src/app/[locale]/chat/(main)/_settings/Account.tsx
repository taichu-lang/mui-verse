import { useAuth } from "@/auth/auth";
import { UsageProgress } from "@/components/blocks/usage/UsageProgress";
import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useBalance } from "@/hooks/useBalance";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { DataItem, DataSeparator } from "./DataList";

export function Account() {
  const t = useTranslations();
  const { session } = useAuth();
  const { standard, advanced, frontier } = useBalance();

  if (!session) {
    return null;
  }

  const plan = session.subscription.plan_code;

  return (
    <TabMenuPanel value="account">
      <DataItem label={t("settings.account.name")}>{session.name}</DataItem>
      <DataSeparator />
      <DataItem label={t("settings.account.email")}>{session.email}</DataItem>
      <DataSeparator />
      <DataItem label={t(`profile.${plan}.plan`)}>
        <Button className="h-6 px-2.5 py-1 text-xs">
          {t(`profile.${plan}.upgrade`)}
        </Button>
      </DataItem>
      <DataSeparator />
      <p className="mt-1.75 text-sm">{t("settings.account.usage")}</p>
      {standard && (
        <UsageProgress balance={standard} plan={plan} className="mt-3.5" />
      )}
      {advanced && (
        <UsageProgress balance={advanced} plan={plan} className="mt-3.5" />
      )}
      {frontier && (
        <UsageProgress balance={frontier} plan={plan} className="mt-3.5" />
      )}
      <Link
        href={"/usage"}
        className="text-text-secondary mt-3.5 flex items-center gap-1.5 text-xs"
      >
        {t("settings.account.viewUsage")}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </TabMenuPanel>
  );
}
