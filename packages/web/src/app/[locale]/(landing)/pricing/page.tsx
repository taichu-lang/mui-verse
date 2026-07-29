import { PillTab, TabContext } from "@mui-verse/ui/components/navigation";
import { BenefitTableList } from "./_blocks/BenefitTable";
import { FeatureHeader } from "./_blocks/FeatureHeader";
import { PlanPanels } from "./_blocks/PlanPanel";
import { MonthLabel, PlanTabs, YearLabel } from "./_blocks/PlanTab";
import { useTranslations } from "next-intl";

export default function PricingPage() {
  const t = useTranslations();

  return (
    <div className="w-pricing-width mx-auto flex flex-col items-center">
      <h1 className="mt-15">{t("pricing.hero")}</h1>
      <p className="text-text-secondary mt-5 text-base">
        {t("pricing.subtitle")}
      </p>
      <TabContext defaultValue="monthly">
        <PlanTabs className="mt-4">
          <PillTab
            value="monthly"
            label={<MonthLabel />}
            className="px-3.5 py-2.5"
          />
          <PillTab
            value="yearly"
            label={<YearLabel />}
            className="px-3.5 py-2.5"
          />
        </PlanTabs>
        <PlanPanels />
        <div
          id="features"
          className="scroll-mt-landing-navbar mt-20 mb-15 w-full"
        >
          <h2 className="text-center">{t("pricing.features")}</h2>
          <FeatureHeader />
          <BenefitTableList />
        </div>
      </TabContext>
    </div>
  );
}
