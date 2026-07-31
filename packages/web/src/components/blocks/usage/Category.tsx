import { QuestionCircleIcon } from "@/components/icons";
import { useBenefit } from "@/hooks/useBenefit";
import { Balance } from "@/lib/types/benefit";
import { PlanCode } from "@/lib/types/enums";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mui-verse/ui/components/navigation";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";

export function QuotaTip({
  balance,
  plan,
}: {
  balance?: Balance;
  plan: PlanCode;
}) {
  const t = useTranslations();
  const { basicQuota, advancedQuota, frontierQuota } = useBenefit();

  if (!balance) {
    return null;
  }

  const getCycle = () => {
    switch (balance.benefit_code) {
      case "standard_chat": {
        const { cycle } = basicQuota(plan);
        return cycle;
      }

      case "advanced_chat": {
        const { cycle } = advancedQuota();
        return cycle;
      }

      case "frontier_chat": {
        const { cycle } = frontierQuota();
        return cycle;
      }
    }
  };

  const cycle = getCycle();

  return (
    <Popover side="top" align="center">
      <PopoverTrigger>
        {/* The element must be hover-able */}
        <div>
          <QuestionCircleIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent
        sx={{ width: "387px", px: "18px", py: "14px", mt: "-8px" }}
      >
        <div className="flex flex-col">
          <span className="text-base font-medium">
            {t(`balance.${balance.benefit_code}.title`)}
          </span>
          <div className="mt-2.25 flex items-center justify-between">
            <span className="text-sm">
              {t(`balance.${balance.benefit_code}.quotaLabel`, { cycle })}
            </span>
            <span className="text-sm">
              {balance.remaining}/{balance.limit}
            </span>
          </div>
          <Divider className="my-3.5" />
          <span className="text-text-secondary text-sm">
            {t(`balance.${balance.benefit_code}.description`, { cycle })}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function CategoryUsage({
  Icon,
  title,
  tip,
  quota,
}: {
  Icon: React.ElementType;
  title: string;
  tip: React.ReactNode;
  quota: number;
}) {
  return (
    <div className="flex items-center">
      <Icon />
      <span className="mr-2 ml-2.5">{title}</span>
      {tip}
      <div className="flex-1"></div>
      <span className="text-sm">{quota}</span>
    </div>
  );
}
