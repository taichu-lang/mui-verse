import { useTranslations } from "next-intl";
import Image from "next/image";
import { Chip } from "./Chip";
import { Section } from "./Section";

export function UiSection() {
  const t = useTranslations();

  return (
    <Section id="product">
      <Chip label={t("landing.ui.chip")} gray />
      <h2 className="mt-7.5">{t("landing.ui.title")}</h2>
      <span className="text-text-secondary mt-5 text-base">
        {t("landing.ui.subtitle")}
      </span>
      <div className="mt-15 grid grid-cols-2 gap-25">
        <div className="flex flex-col items-center gap-3">
          <h3>{t("landing.ui.history.title")}</h3>
          <span className="text-text-secondary text-base">
            {t("landing.ui.history.subtitle")}
          </span>
          <Image
            src={"/images/landing-ui-01.png"}
            alt="ui-01"
            width={269}
            height={253}
            className="mt-3"
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <h3>{t("landing.ui.models.title")}</h3>
          <span className="text-text-secondary text-base">
            {t("landing.ui.models.subtitle")}
          </span>
          <Image
            src={"/images/landing-ui-02.png"}
            alt="ui-01"
            width={264}
            height={432}
            className="mt-3"
          />
        </div>
      </div>
      <div className="mt-20 flex flex-col items-center gap-3">
        <h3>{t("landing.ui.search.title")}</h3>
        <span className="text-text-secondary text-base">
          {t("landing.ui.search.subtitle")}
        </span>
        <Image
          src={"/images/landing-ui-03.png"}
          alt="web search"
          width={770}
          height={246}
          className="mt-9 object-cover"
        />
      </div>
      <div className="mt-20 flex flex-col items-center gap-3">
        <h3>{t("landing.ui.sources.title")}</h3>
        <span className="text-text-secondary text-xl">
          {t("landing.ui.sources.subtitle")}
        </span>
        <Image
          src={"/images/landing-ui-04.png"}
          alt="web search annotation"
          width={870}
          height={523}
          className="mt-4"
        />
      </div>
    </Section>
  );
}
