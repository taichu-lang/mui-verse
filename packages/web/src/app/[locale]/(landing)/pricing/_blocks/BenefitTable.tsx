"use client";

import { CheckIcon, XIcon } from "@/components/icons";
import { useBenefit } from "@/hooks/useBenefit";
import { Benefit, getPlanBenefit } from "@/lib/types/benefit";
import { modelIcons, modelMap } from "@/lib/types/model";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";

function Model({ model_id }: { model_id: string }) {
  const model = modelMap[model_id];
  const Icon = modelIcons[model.provider];

  return (
    <div className="flex items-center gap-2.5 text-base">
      <Icon className="h-5 w-5" />
      {model.name}
    </div>
  );
}

export function BenefitTable({ benefit }: { benefit: Benefit }) {
  const t = useTranslations();
  const { plans, basicQuota, advancedQuota, frontierQuota } = useBenefit();
  const free = plans.find((p) => p.code === "free");
  const pro = plans.find((p) => p.code === "pro");
  const freeBenefit = getPlanBenefit(benefit.code, free);
  const proBenefit = getPlanBenefit(benefit.code, pro);

  const stringifyFreeQuota = () => {
    switch (benefit.code) {
      case "basic_models":
        const { quota } = basicQuota("free");
        return quota;
      case "advanced_models":
        return 0;
      case "frontier_models":
        return 0;
    }
  };

  const stringifyProQuota = () => {
    switch (benefit.code) {
      case "basic_models": {
        const { quota } = basicQuota("pro");
        return quota;
      }
      case "advanced_models": {
        const { quota } = advancedQuota();
        return quota;
      }
      case "frontier_models": {
        const { quota } = frontierQuota();
        return quota;
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center">
        <div className="col-span-2 flex flex-col items-start gap-7.5">
          <p className="text-base">{t(`pricing.${benefit.code}.title`)}</p>
          {benefit.resources.map((r) => {
            if (r.type === "model") {
              return <Model model_id={r.id} key={r.id} />;
            }

            return null;
          })}
        </div>
        <div className="col-span-1 flex flex-col items-start gap-7.5">
          <p className="text-base">{stringifyFreeQuota()}</p>
          {benefit.resources.map((r) => {
            if (r.type === "model") {
              if (freeBenefit) {
                return <CheckIcon key={`free-${r.id}`} className="h-6" />;
              } else {
                return <XIcon key={`free-${r.id}`} className="h-6" />;
              }
            }

            return null;
          })}
        </div>
        <div className="col-span-1 flex flex-col items-start gap-7.5">
          <p className="text-base">{stringifyProQuota()}</p>
          {benefit.resources.map((r) => {
            if (r.type === "model") {
              if (proBenefit) {
                return <CheckIcon key={`pro-${r.id}`} className="h-6" />;
              } else {
                return <XIcon key={`pro-${r.id}`} className="h-6" />;
              }
            }

            return null;
          })}
        </div>
      </div>
      <p className="text-text-secondary mt-7.5 text-sm">
        {t(`pricing.${benefit.code}.description`)}
      </p>
    </>
  );
}

export function BenefitTableList() {
  const { benefits } = useBenefit();
  return (
    <>
      {benefits.map((benefit, index) => (
        <div key={benefit.code} className="w-full">
          <Divider flexItem className={index === 0 ? "mb-7.5" : "my-7.5"} />
          <BenefitTable benefit={benefit} />
        </div>
      ))}
    </>
  );
}
