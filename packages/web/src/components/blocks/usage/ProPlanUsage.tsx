import { AdvancedIcon, CreditIcon, StandardIcon } from "@/components/icons";
import { useBalance } from "@/hooks/useBalance";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mui-verse/ui/components/navigation";
import { Divider } from "@mui/material";
import { CategoryUsage, QuotaTip } from "./Category";

export function ProPlanUsage() {
  const { standard, advanced, frontier } = useBalance();

  return (
    <Popover align="center" side="top">
      <PopoverTrigger>
        <IconGhostButton className="hover:bg-action-hover gap-1.5 rounded-full px-2 py-1">
          <CreditIcon />
          <span className="text-text-secondary text-sm">
            {frontier?.remaining || 0}
          </span>
        </IconGhostButton>
      </PopoverTrigger>
      <PopoverContent
        sx={{ width: "308px", px: "16px", py: "14px", mt: "-10px" }}
      >
        <div className="flex flex-col gap-4 p-0">
          <p className="text-base">Pro Plan</p>
          <Divider className="-my-2" />
          <CategoryUsage
            Icon={StandardIcon}
            title="Standard queries"
            tip={<QuotaTip balance={standard} plan="pro" />}
            quota={standard?.remaining || 0}
          />
          <CategoryUsage
            Icon={AdvancedIcon}
            title="Advanced queries"
            tip={<QuotaTip balance={advanced} plan="pro" />}
            quota={advanced?.remaining || 0}
          />
          <CategoryUsage
            Icon={CreditIcon}
            title="Credits"
            tip={<QuotaTip balance={frontier} plan="pro" />}
            quota={frontier?.remaining || 0}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
