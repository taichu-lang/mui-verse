import { PillTab, TabContext } from "@mui-verse/ui/components/navigation";
import { BenefitTableList } from "./_blocks/BenefitTable";
import { FeatureHeader } from "./_blocks/FeatureHeader";
import { PlanPanels } from "./_blocks/PlanPanel";
import { MonthLabel, PlanTabs, YearLabel } from "./_blocks/PlanTab";

export default function PricingPage() {
  return (
    <div className="w-pricing-width mx-auto flex flex-col items-center">
      <h1 className="mt-15">One tab. Infinite intelligence.</h1>
      <p className="text-text-secondary mt-5 text-base">
        Stop switching between apps. Every leading AI model, one seamless
        experience.
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
        <h2 className="mt-20 text-center">Plan features</h2>
        <FeatureHeader />
        <BenefitTableList />
      </TabContext>
    </div>
  );
}
