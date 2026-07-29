import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function FreePlanButton({ className }: { className?: string }) {
  const t = useTranslations();
  const { session } = useAuth();
  const title =
    session?.plan_code === "pro"
      ? t("pricing.free.actionPro")
      : t("pricing.free.actionFree");

  return (
    <Button
      LinkComponent={Link}
      size="small"
      fullWidth
      variant="outlined"
      className={className}
      href={session ? "/chat" : "/signin"}
    >
      {title}
    </Button>
  );
}

export function ProPlanButton({ className }: { className?: string }) {
  const t = useTranslations();
  const { session } = useAuth();
  const title =
    session?.plan_code === "pro"
      ? t("pricing.pro.actionPro")
      : t("pricing.pro.actionFree");

  return (
    <Button
      LinkComponent={Link}
      size="small"
      fullWidth
      className={cn("from-primary-500 bg-linear-to-r to-[#27B2E5]", className)}
      href={session ? "/checkout" : "/signin"}
    >
      {title}
    </Button>
  );
}
