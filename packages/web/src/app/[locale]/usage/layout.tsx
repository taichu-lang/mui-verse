"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { UpgradeTips } from "./UpgradeTips";

export default function UsageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="w-usage-width mx-auto mt-8 flex h-full flex-col">
      <Button
        variant="outlined"
        size="small"
        onClick={() => router.back()}
        className="w-fit"
      >
        {t("usage.back")}
      </Button>
      <div className="mt-6 mb-2 flex items-center gap-3.5">
        <p className="py-2.5 text-lg font-semibold">{t("usage.title")}</p>
        <UpgradeTips />
      </div>
      <div className="mb-10 overflow-y-auto">{children}</div>
    </div>
  );
}
