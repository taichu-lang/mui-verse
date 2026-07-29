import { UserIcon } from "@/components/icons";
import { ArrowRightLeftIcon, GlobeIcon, MessageCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Chip } from "./Chip";
import { Section } from "./Section";

function FeatureCard({
  Icon,
  title,
  description,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-47.5 flex-col gap-3.5 rounded-[30px] px-6 pt-6.5 shadow-(--mui-shadow-border)">
      <div className="flex h-10.5 w-10.5 items-center justify-center rounded-full bg-gray-950">
        <Icon className="h-6 w-6 text-white" strokeWidth="2" />
      </div>
      <p className="text-sm">{title}</p>
      <span className="text-text-secondary text-xs text-wrap">
        {description}
      </span>
    </div>
  );
}

export function FeatureSection() {
  const t = useTranslations();

  return (
    <Section white>
      <Chip label={t("landing.features.chip")} />
      <h2 className="mt-7.5">{t("landing.features.title")}</h2>
      <p className="text-text-secondary mt-5 text-base">
        {t("landing.features.subtitle")}
      </p>
      <div className="mt-10 grid grid-cols-4 gap-5.5">
        <FeatureCard
          Icon={UserIcon}
          title={t("landing.features.accountTitle")}
          description={t("landing.features.accountDesc")}
        />
        <FeatureCard
          Icon={ArrowRightLeftIcon}
          title={t("landing.features.modelTitle")}
          description={t("landing.features.modelDesc")}
        />
        <FeatureCard
          Icon={GlobeIcon}
          title={t("landing.features.searchTitle")}
          description={t("landing.features.searchDesc")}
        />
        <FeatureCard
          Icon={MessageCircleIcon}
          title={t("landing.features.historyTitle")}
          description={t("landing.features.historyDesc")}
        />
      </div>
    </Section>
  );
}
