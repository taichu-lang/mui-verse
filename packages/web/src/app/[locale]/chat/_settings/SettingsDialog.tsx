"use client";

import { QuestionIcon, SettingsIcon, UserIcon } from "@/components/icons";
import { usePathname } from "@/i18n/navigation";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { DefaultDialog } from "@mui-verse/ui/components/feedback";
import { CloseXIcon } from "@mui-verse/ui/components/icons";
import {
  TabMenu,
  TabMenuContext,
  useTabMenuContext,
} from "@mui-verse/ui/layout/TabMenu";
import { DialogContent, Divider } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { General } from "./General";
import { Help } from "./Help";
import { parseHash } from "./lib";
import { AuthFilter } from "@/auth/AuthFilter";

function TabTitle() {
  const { title } = useTabMenuContext();
  return (
    <>
      <span className="my-5 text-lg">{title}</span>
      <Divider flexItem />
    </>
  );
}

export default function SettingsDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const modal = search.get("modal");
  const hash = useMemo(() => parseHash(modal), [modal]);

  const handleClose = () => {
    router.replace(pathname);
  };

  const handleTabSwitch = (tab: string) => {
    router.replace(`${pathname}?modal=settings/${tab}`);
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
      <DialogContent className="h-settings-height flex p-0">
        <TabMenuContext
          defaultIndex={hash.slug || "general"}
          onChange={handleTabSwitch}
        >
          <div className="ml-2 flex w-42 flex-col">
            <IconGhostButton
              className="hover:bg-action-hover mt-2.5 mb-1.5 ml-px h-8 w-8"
              onClick={handleClose}
            >
              <CloseXIcon />
            </IconGhostButton>
            <AuthFilter>
              <TabMenu title="Account" icon={<UserIcon />} value="account" />
            </AuthFilter>
            <TabMenu title="General" icon={<SettingsIcon />} value="general" />
            <TabMenu title="Help" icon={<QuestionIcon />} value="help" />
          </div>
          <div className="mx-7.5 flex flex-1 flex-col">
            <TabTitle />
            <General />
            <Help />
          </div>
        </TabMenuContext>
      </DialogContent>
    </DefaultDialog>
  );
}
