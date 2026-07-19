"use client";

import { CheckIcon } from "@/components/icons";
import { CheckXIcon } from "@/components/icons/Check";
import { useBenefit } from "@/hooks/useBenefit";
import { Benefit } from "@/lib/types/benefit";
import { modelIcons, modelMap } from "@/lib/types/model";
import { Divider } from "@mui/material";

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
  const { plans } = useBenefit();
  const free = plans.find((p) => p.type === "free");
  const pro = plans.find((p) => p.type === "pro");
  const freeEnabled = free?.benefits.includes(benefit.code);
  const proEnabled = pro?.benefits.includes(benefit.code);

  return (
    <div className="flex items-center">
      <div className="w-landing-feature-left flex flex-col items-start gap-7.5">
        <p className="text-base">{benefit.code}</p>
        {benefit.resources.map((r) => {
          if (r.type === "model") {
            return <Model model_id={r.id} key={r.id} />;
          }

          return null;
        })}
      </div>
      <div className="w-landing-feature-mid flex flex-col items-start gap-7.5">
        <p className="text-base">
          {benefit.limit}/{free?.duration}
        </p>
        {benefit.resources.map((r) => {
          if (r.type === "model") {
            if (freeEnabled) {
              return <CheckIcon key={`free-${r.id}`} className="h-6" />;
            } else {
              return <CheckXIcon key={`free-${r.id}`} className="h-6" />;
            }
          }

          return null;
        })}
      </div>
      <div className="w-landing-feature-right flex flex-col items-start gap-7.5">
        <p className="text-base">
          {benefit.limit}/{pro?.duration}
        </p>
        {benefit.resources.map((r) => {
          if (r.type === "model") {
            if (proEnabled) {
              return <CheckIcon key={`pro-${r.id}`} className="h-6" />;
            } else {
              return <CheckXIcon key={`pro-${r.id}`} className="h-6" />;
            }
          }

          return null;
        })}
      </div>
    </div>
  );
}

export function BenefitTableList() {
  const { benefits } = useBenefit();
  return (
    <div className="flex flex-col">
      {benefits.map((benefit) => (
        <div key={benefit.code}>
          <Divider flexItem className="my-7.5" />
          <BenefitTable benefit={benefit} />
        </div>
      ))}
    </div>
  );
}
