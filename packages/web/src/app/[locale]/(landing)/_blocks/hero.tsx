"use client";

import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { Dot } from "@/components/ui/Dot";
import { Chip } from "./Chip";
import { Section } from "./Section";

export function HeroSection() {
  const { session } = useAuth();

  return (
    <Section>
      <Chip
        icon={<Dot />}
        label="Supports GPT · Claude · Gemini & other leading models"
        gray
      />
      <h1 className="mt-10">One tab. Infinite intelligence.</h1>
      <p className="mt-5 text-base">
        Access top AI models in one place. Web search and conversation history
        included.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <Button color="dark" href={session ? "/chat" : "/signin"}>
          Start for free
        </Button>
        <Button color="dark" href="/pricing">
          View pricing
        </Button>
      </div>
    </Section>
  );
}
