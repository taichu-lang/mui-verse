import { Button } from "@/components/ui/Button";
import { Chip } from "./Chip";
import { Section } from "./Section";

export function HeroSection() {
  return (
    <Section id="hero">
      <Chip
        icon={<div className="bg-primary-500 h-1.5 w-1.5 rounded-full" />}
        label="Supports GPT · Claude · Gemini & other leading models"
        gray
      />
      <h1 className="mt-10">One tab. Infinite intelligence.</h1>
      <p className="mt-5 text-base">
        Access top AI models in one place. Web search and conversation history
        included.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Button className="bg-gray-950 text-white">Start for free</Button>
        <Button className="bg-gray-950 text-white">View pricing</Button>
      </div>
    </Section>
  );
}
