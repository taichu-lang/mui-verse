"use client";

import { useAuth } from "@/auth/auth";
import { AuthFilter } from "@/auth/AuthFilter";
import {
  QuestionIcon,
  SettingsIcon,
  ShieldAlertIcon,
  UserIcon,
  WalletIcon,
} from "@/components/icons";
import { useSettingsLink } from "@/hooks/useSettingsLink";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { DefaultDialog } from "@mui-verse/ui/components/feedback";
import { CloseXIcon } from "@mui-verse/ui/components/icons";
import {
  TabMenu,
  TabMenuContext,
  useTabMenuContext,
} from "@mui-verse/ui/layout/TabMenu";
import { DialogContent, Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Account } from "./Account";
import { Billing } from "./Billing";
import { General } from "./General";
import { Help } from "./Help";
import { parseHash } from "./lib";
import { Security } from "./Security";

function TabTitle() {
  const { title } = useTabMenuContext();
  return (
    <>
      <span className="my-5 text-lg">{title}</span>
      <Divider flexItem className="mb-2.25" />
    </>
  );
}

export default function SettingsDialog() {
  const t = useTranslations();
  const router = useRouter();
  const search = useSearchParams();
  const modal = search.get("modal");
  const hash = useMemo(() => parseHash(modal), [modal]);
  const { navigateLink, backLink } = useSettingsLink();
  const hasAuthorization = useAuth.useHasAuthorization();
  const defaultPanel = hash.slug || (hasAuthorization ? "account" : "general");

  const handleClose = () => {
    const target = backLink();
    router.replace(target);
  };

  const handleTabSwitch = (tab: string) => {
    const target = navigateLink(`settings/${tab}`);
    router.replace(target);
  };

  return (
    <DefaultDialog
      open={hash.section === "settings"}
      onClose={handleClose}
      maxWidth={"md"}
      sx={{
        width: "var(--spacing-settings-width)",
        padding: 0,
      }}
    >
      <DialogContent className="h-settings-height flex overflow-hidden p-0">
        <TabMenuContext defaultIndex={defaultPanel} onChange={handleTabSwitch}>
          <div className="ml-2 flex w-42 flex-col">
            <IconGhostButton
              className="hover:bg-action-hover mt-2.5 mb-1.5 ml-px h-8 w-8"
              onClick={handleClose}
            >
              <CloseXIcon />
            </IconGhostButton>
            <AuthFilter>
              <TabMenu
                title={t("settings.account.nav")}
                icon={<UserIcon className="h-4.5 w-4.5" />}
                value="account"
              />
            </AuthFilter>
            <TabMenu
              title={t("settings.general.nav")}
              icon={<SettingsIcon />}
              value="general"
            />
            <AuthFilter>
              <TabMenu
                title={t("settings.billing.nav")}
                icon={<WalletIcon />}
                value="billing"
              />
              <TabMenu
                title={t("settings.security.nav")}
                icon={<ShieldAlertIcon className="h-4.5 w-4.5" />}
                value="security"
              />
            </AuthFilter>
            <TabMenu
              title={t("settings.help.nav")}
              icon={<QuestionIcon />}
              value="help"
            />
          </div>
          <div className="mx-7.5 flex flex-1 flex-col">
            <TabTitle />
            <Account />
            <General />
            <Billing />
            <Security />
            <Help />
          </div>
        </TabMenuContext>
      </DialogContent>
    </DefaultDialog>
  );
}
