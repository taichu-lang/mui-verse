"use client";

import {
  ChevronDownIcon,
  QuestionIcon,
  SettingsIcon,
} from "@/components/icons";
import { usePathname } from "@/i18n/navigation";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { DefaultDialog } from "@mui-verse/ui/components/feedback";
import { CloseXIcon } from "@mui-verse/ui/components/icons";
import {
  DropdownSelect,
  DropdownSelectOption,
} from "@mui-verse/ui/components/inputs";
import {
  TabMenu,
  TabMenuContext,
  TabMenuPanel,
  useTabMenuContext,
} from "@mui-verse/ui/layout/TabMenu";
import { DialogContent, Divider } from "@mui/material";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { parseHash } from "./lib";

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
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const modal = search.get("modal");
  const hash = useMemo(() => parseHash(modal), [modal]);

  return (
    <DefaultDialog
      open={hash.section === "settings"}
      onClose={() => {
        router.replace(pathname);
      }}
      maxWidth={"md"}
      sx={{
        width: "682px",
        padding: 0,
      }}
    >
      <DialogContent className="flex h-144.5 p-0">
        <TabMenuContext defaultIndex="general">
          <div className="ml-2 flex w-42 flex-col">
            <IconGhostButton className="hover:bg-action-hover mt-2.5 mb-1.5 ml-px h-8 w-8">
              <CloseXIcon />
            </IconGhostButton>
            <TabMenu title="General" icon={<SettingsIcon />} value="general" />
            <TabMenu title="Help" icon={<QuestionIcon />} value="help" />
          </div>
          <div className="mx-7.5 flex flex-1 flex-col">
            <TabTitle />
            <TabMenuPanel value="general">
              <div className="mt-4 flex justify-between">
                <span className="text-sm">Language</span>
                <DropdownSelect
                  side="cover"
                  align="end"
                  defaultValue={locale}
                  IconComponent={ChevronDownIcon}
                >
                  <DropdownSelectOption value="en">
                    English
                  </DropdownSelectOption>
                  <DropdownSelectOption value="ru">
                    български
                  </DropdownSelectOption>
                </DropdownSelect>
              </div>
            </TabMenuPanel>
          </div>
        </TabMenuContext>
      </DialogContent>
    </DefaultDialog>
  );
}
