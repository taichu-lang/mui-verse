import { Balance } from "@/lib/types/benefit";
import { PlanCode } from "@/lib/types/enums";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import { QuotaTip } from "./Category";
import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";

function BorderLinearProgress({ value, max }: { value: number; max: number }) {
  if (max === 0) {
    return null;
  }

  return (
    <LinearProgress
      sx={{
        height: 10,
        borderRadius: 5,
        bgcolor: "action.hover",
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
        },
      }}
      value={(value * 100) / max}
      variant="determinate"
    />
  );
}

export function UsageProgress({
  balance,
  plan,
  className,
}: {
  balance: Balance;
  plan: PlanCode;
  className?: string;
}) {
  const t = useTranslations();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <span className="text-xs">
          {t(`balance.${balance.benefit_code}.availableLabel`)}
        </span>
        <QuotaTip balance={balance} plan={plan} />
        <div className="flex-1" />
        <span className="text-xs">
          {balance.remaining}/{balance.limit}
        </span>
      </div>
      <BorderLinearProgress value={balance.remaining} max={balance.limit} />
    </div>
  );
}
