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
    <>
      <div className="grid grid-cols-4 items-center">
        <div className="col-span-2 flex flex-col items-start gap-7.5">
          <p className="text-base">{benefit.code}</p>
          {benefit.resources.map((r) => {
            if (r.type === "model") {
              return <Model model_id={r.id} key={r.id} />;
            }

            return null;
          })}
        </div>
        <div className="col-span-1 flex flex-col items-start gap-7.5">
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
        <div className="col-span-1 flex flex-col items-start gap-7.5">
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
      <p className="text-text-secondary mt-7.5 text-sm">
        Basic models consume Standard queries. Each request a user sends
        consumes one Standard query.
      </p>
    </>
  );
}

export function BenefitTableList() {
  const { benefits } = useBenefit();
  return (
    <>
      {benefits.map((benefit) => (
        <div key={benefit.code} className="w-full">
          <Divider flexItem className="my-7.5" />
          <BenefitTable benefit={benefit} />
        </div>
      ))}
    </>
  );
}
