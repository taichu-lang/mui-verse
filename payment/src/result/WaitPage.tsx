import { AnimatedSpinner } from "@mui-verse/ui/components/effects";
import { useTranslations } from "next-intl";

export function WaitPage() {
  const t = useTranslations();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-4 flex w-md flex-col items-center gap-10 sm:mx-0">
        <AnimatedSpinner />
        <p className="text-2xl">{t("v-payment.wait.title")}</p>
        <p className="text-base">{t("v-payment.wait.description")}</p>
      </div>
    </div>
  );
}
