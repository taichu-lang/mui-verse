import { Divider } from "@mui/material";
import { CapabilitiesSection } from "./_blocks/capabilities";
import { FaqSection } from "./_blocks/faq";
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
      <FaqSection />
      {/* Add a divider between lading page content and footer */}
      <Divider flexItem />
    </>
  );
}
