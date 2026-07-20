import { CapabilitiesSection } from "./_blocks/capabilities";
import { FeatureSection } from "./_blocks/feature";
import { HeroSection } from "./_blocks/hero";
import { ModelSection } from "./_blocks/models";
import { UiSection } from "./_blocks/ui";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <ModelSection />
      <CapabilitiesSection />
      <UiSection />
    </>
  );
}
