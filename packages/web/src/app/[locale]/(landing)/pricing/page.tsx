import { PillTab, TabContext } from "@mui-verse/ui/components/navigation";
import { BenefitTableList } from "./_blocks/BenefitTable";
import { FeatureHeader } from "./_blocks/FeatureHeader";
import { PlanPanels } from "./_blocks/PlanPanel";
import { MonthLabel, PlanTabs, YearLabel } from "./_blocks/PlanTab";

export default function PricingPage() {
  return (
    <div className="w-landing-width mx-auto flex flex-col items-center">
      <h1 className="mt-15 font-semibold">One tab. Infinite intelligence.</h1>
      <p className="text-text-secondary mt-2 text-base">
        Stop switching between apps. Every leading AI model, one seamless
        experience.
      </p>
      <TabContext defaultValue="monthly">
        <PlanTabs>
          <PillTab
            value="monthly"
            label={<MonthLabel />}
            className="flex px-3.5 py-2.5 text-base leading-4.5"
          />
          <PillTab
            value="yearly"
            label={<YearLabel />}
            className="flex px-3.5 py-2.5"
          />
        </PlanTabs>
        <PlanPanels />
      </TabContext>
      <div className="mt-20">
        <p className="text-center text-2xl font-semibold">Plan features</p>
        <FeatureHeader />
        <BenefitTableList />
      </div>
    </div>
  );
}
