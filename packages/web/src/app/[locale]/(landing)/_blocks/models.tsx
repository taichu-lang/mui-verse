import { modelIcons, modelMap } from "@/lib/types/model";
import { useTranslations } from "next-intl";
import { Chip } from "./Chip";
import { Section } from "./Section";

interface ModelProps {
  id: string;
  description: string;
}

function ModelCard({ id, description }: ModelProps) {
  const model = modelMap[id];
  const Icon = modelIcons[model.provider];

  return (
    <div className="flex h-47.5 flex-col gap-3.5 rounded-[30px] px-6 pt-6.5 shadow-(--mui-shadow-border)">
      <Icon className="h-10.5 w-10.5" />
      <p className="text-sm">{model.name}</p>
      <span className="text-text-secondary text-xs text-wrap">
        {description}
      </span>
    </div>
  );
}

export function ModelSection() {
  const t = useTranslations();

  const models: ModelProps[] = [
    {
      id: "claude-opus-4-7",
      description: t("landing.models.clade_opus_4_7"),
    },
    {
      id: "gpt-5.5",
      description: t("landing.models.gpt_5_4_pro"),
    },
    {
      id: "gemini-3.1-pro-preview",
      description: t("landing.models.gemini_3_1_pro"),
    },
    {
      id: "gpt-5.3-codex",
      description: t("landing.models.gpt_5_3_codex"),
    },
    {
      id: "claude-opus-4-6",
      description: t("landing.models.claude_opus_4_6"),
    },
    {
      id: "claude-sonnet-4-6",
      description: t("landing.models.claude_sonnet_4_6"),
    },
    {
      id: "gemini-3-flash-preview",
      description: t("landing.models.gemini_3_flash"),
    },
    {
      id: "gpt-5.4",
      description: t("landing.models.gpt_5_4"),
    },
  ];

  return (
    <Section>
      <Chip label={t("landing.models.chip")} gray />
      <h2 className="mt-7.5">{t("landing.models.title")}</h2>
      <p className="text-text-secondary mt-5 text-base">
        {t("landing.models.subtitle1")}
        <span className="font-semibold">20+</span>
        {t("landing.models.subtitle2")}
      </p>
      <div className="mt-10 grid grid-cols-4 gap-5.5">
        {models.map((model) => (
          <ModelCard {...model} key={model.id} />
        ))}
      </div>
    </Section>
  );
}
