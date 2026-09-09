import { Button } from "@mui/material";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function SuccessPage({ onClick }: { onClick: () => void }) {
  const t = useTranslations();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-4 flex w-md flex-col items-center gap-10 sm:mx-0">
        <CheckIcon className="h-6 w-6" />
        <p className="mt-1.5 text-2xl">{t("v-payment.success.title")}</p>
        <p className="text-base">{t("v-payment.success.description")}</p>
        <Button className="mt-16 px-2.5 py-2 text-sm" onClick={onClick}>
          {t("v-payment.success.confirm")}
        </Button>
      </div>
    </div>
  );
}
