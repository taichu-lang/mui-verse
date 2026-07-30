import { UpgradeCard } from "@/components/blocks/benefit/UpgradeCard";
import { RocketIcon, StandardIcon } from "@/components/icons";
import { useBalance } from "@/hooks/useBalance";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mui-verse/ui/components/navigation";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { CategoryUsage, QuotaTip } from "./Category";

export function FreePlanUsage() {
  const t = useTranslations();
  const { standard } = useBalance();
  const remaining = standard?.remaining || 0;

  return (
    <div className="flex items-center gap-2.5">
      <Popover align="center" side="top">
        <PopoverTrigger>
          <IconGhostButton className="hover:bg-action-hover gap-1.5 rounded-full px-2 py-1">
            <RocketIcon />
            <span className="text-text-secondary text-sm">
              {t("chat.textarea.upgrade")}
            </span>
          </IconGhostButton>
        </PopoverTrigger>
        <PopoverContent
          sx={{
            px: 0,
            py: 0,
            mt: "-10px",
            width: "395px",
            minHeight: "346px", // height is needed, due to UpgradeCard has conditional render.
          }}
        >
          <UpgradeCard />
        </PopoverContent>
      </Popover>
      <Popover align="center" side="top">
        <PopoverTrigger>
          <IconGhostButton className="hover:bg-action-hover gap-1.5 rounded-full px-2 py-1">
            <StandardIcon />
            <span className="text-text-secondary text-sm">{remaining}</span>
          </IconGhostButton>
        </PopoverTrigger>
        <PopoverContent
          sx={{ width: "308px", px: "16px", py: "14px", mt: "-10px" }}
        >
          <div className="flex flex-col gap-4 p-0">
            <p className="text-base">Free Plan</p>
            <Divider className="-my-2" />
            <CategoryUsage
              Icon={StandardIcon}
              title="Standard queries"
              tip={<QuotaTip balance={standard} plan="free" />}
              quota={remaining}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
