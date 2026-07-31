import { useAuth } from "@/auth/auth";
import { ChevronRightIcon } from "@/components/icons";
import { useChangePassword } from "@/hooks/useChangePassword";
import { TabMenuPanel } from "@mui-verse/ui/layout/TabMenu";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { DataItem } from "./DataList";

export function Security() {
  const t = useTranslations();
  const { session } = useAuth();
  const { action, setValue } = useChangePassword();

  useEffect(() => {
    if (!session) {
      return;
    }

    const { auth_methods } = session;
    if ("password" in auth_methods) {
      setValue({ email: session.email, action: "reset" });
    } else {
      setValue({ email: session.email, action: "add" });
    }
  }, [session, setValue]);

  if (!session) {
    return null;
  }

  return (
    <TabMenuPanel value="security">
      <DataItem label={t("settings.security.password")}>
        <div className="flex items-center gap-1 text-sm">
          {t(`settings.security.${action}`)}
          <ChevronRightIcon className="h-4.5 w-4.5" />
        </div>
      </DataItem>
    </TabMenuPanel>
  );
}
