import { Button } from "@mui/material";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function FailedPage({ onClick }: { onClick: () => void }) {
  const t = useTranslations();

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="mx-4 flex w-md flex-col items-center gap-10 sm:mx-0">
        <XIcon className="h-6 w-6" strokeWidth={1.5} />
        <p className="mt-1.5 text-2xl">{t("v-payment.failed.title")}</p>
        <p className="text-base">{t("v-payment.failed.description")}</p>
        <Button
          className="text-text-primary mt-16 px-2.5 py-2 text-sm"
          onClick={onClick}
          variant="outlined"
        >
          {t("v-payment.failed.confirm")}
        </Button>
      </div>
    </div>
  );
}
