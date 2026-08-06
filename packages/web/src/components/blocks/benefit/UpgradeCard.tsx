"use client";

import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useBenefit } from "@/hooks/useBenefit";
import { stringifyPrice } from "@/lib/types/currency";
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
  const currency = "RUB";
  const t = useTranslations();
  const { discountPercent, monthPrice, yearPrice } = useBenefit();
  const discount = discountPercent(currency);
  const month = monthPrice(currency);
  const year = yearPrice(currency);

  return (
    <div className="flex w-fit flex-col items-center bg-linear-to-b from-[#F2FFFB] to-white px-7.5 pt-4.5 pb-5">
      {/* The width of Card would be same as the benefits, not the title. Use `w-0` to ensure */}
      {/*`w-fit` worked in the Card.*/}
      <p className="w-0 min-w-full text-center text-base">
        {t("chat.textarea.upgradeTip", { discount })}
      </p>
      <div className="mt-3 flex items-baseline gap-4.5">
        <p className="text-primary-500">
          <span className="text-2xl font-semibold">
            {stringifyPrice(year / 12, currency)}
          </span>
          <span className="text-sm">/{t("duration.month")}</span>
        </p>
        <p className="text-text-secondary text-sm font-semibold line-through">
          {stringifyPrice(month, currency)}/{t("duration.month")}
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
