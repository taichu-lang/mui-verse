"use client";

import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useBenefit } from "@/hooks/useBenefit";
import { useTranslations } from "next-intl";
import Link from "next/link";

function BenefitList() {
  const t = useTranslations();
  const { basicQuota, advancedQuota, frontierQuota } = useBenefit();
  const icon = <CheckIcon className="text-primary-500" />;

  const { quota: q1 } = basicQuota("pro");
  const { quota: q2 } = advancedQuota();
  const { quota: q3 } = frontierQuota();

  return (
    <div className="mt-3.5 flex flex-col gap-3 rounded-[18px] bg-[#E6FCF4] px-7.5 py-4.5">
      <div className="flex items-center">
        {icon}
        <span className="ml-2.5 text-sm">
          <>
            {t("pricing.benefits.basic")}
            {" · "}
            <span className="font-semibold">{q1}</span>
          </>
        </span>
      </div>
      <div className="flex items-center">
        {icon}
        <span className="ml-2.5 text-sm">
          <>
            {t("pricing.benefits.advanced")}
            {" · "}
            <span className="font-semibold">{q2}</span>
          </>
        </span>
      </div>
      <div className="flex items-center">
        {icon}
        <span className="ml-2.5 text-sm">{q3}</span>
      </div>
      <div className="flex items-center">
        {icon}
        <span className="ml-2.5 text-sm">{t("pricing.benefits.search")}</span>
      </div>
    </div>
  );
}

export function UpgradeCard() {
  const t = useTranslations();
  const { discountPercent, monthPrice, yearPrice } = useBenefit();
  const discount = discountPercent("RUB");
  const month = monthPrice("RUB");
  const year = yearPrice("RUB");

  return (
    <div className="flex w-full flex-col items-center bg-linear-to-b from-[#F2FFFB] to-white px-7.5 pt-4.5 pb-5">
      <p className="text-base">{t("chat.textarea.upgradeTip", { discount })}</p>
      <div className="mt-3 flex items-baseline gap-4.5">
        <p className="text-primary-500">
          <span className="text-2xl font-semibold">
            ${(year / 12).toFixed(1)}
          </span>
          <span className="text-sm">/{t("duration.mo")}</span>
        </p>
        <p className="text-text-secondary text-sm font-semibold line-through">
          ${month}/{t("duration.mo")}
        </p>
      </div>
      <BenefitList />
      <Button
        variant="contained"
        size="small"
        className="mt-3.5 font-semibold"
        fullWidth
      >
        {t("chat.textarea.upgradeBtn")}
      </Button>
      <Link href={"/"} className="text-primary-500 mt-3.5 font-semibold">
        {t("chat.textarea.planLink")}
      </Link>
    </div>
  );
}
