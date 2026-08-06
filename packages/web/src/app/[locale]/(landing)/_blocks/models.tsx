import { modelIcons, modelMap } from "@/lib/types/model";
import { useTranslations } from "next-intl";
import { Chip } from "./Chip";
import { Section } from "./Section";

interface ModelProps {
  id: string;
}

function ModelCard({ id }: ModelProps) {
  const t = useTranslations();
  const model = modelMap[id];
  const Icon = modelIcons[model.provider];

  return (
    <div className="flex h-47.5 flex-col gap-3.5 rounded-[30px] px-6 pt-6.5 shadow-(--mui-shadow-border)">
      <Icon className="h-10.5 w-10.5" />
      <p className="text-sm">{model.name}</p>
      <span className="text-text-secondary text-xs text-wrap">
        {t(`landing.models.${model.i18n}`)}
      </span>
    </div>
  );
}

export function ModelSection() {
  const t = useTranslations();

  const models: string[] = [
    "claude-opus-4-7",
    "gpt-5.5",
    "gemini-3.1-pro-preview",
    "gpt-5.3-codex",
    "claude-opus-4-6",
    "claude-sonnet-4-6",
    "gemini-3-flash-preview",
    "gpt-5.4",
  ];

  return (
    <Section>
      <Chip label={t("landing.models.chip")} gray />
      <h2 className="mt-7.5">{t("landing.models.title")}</h2>
      <p className="text-text-secondary mt-5 text-base">
        {t.rich("landing.models.subtitle", {
          strong: (chunks) => {
            return <span className="font-semibold">{chunks}</span>;
          },
        })}
      </p>
      <div className="mt-10 grid grid-cols-4 gap-5.5">
        {models.map((model) => (
          <ModelCard id={model} key={model} />
        ))}
      </div>
    </Section>
  );
}
