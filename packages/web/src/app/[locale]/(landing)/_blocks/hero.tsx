"use client";

import { useAuth } from "@/auth/auth";
import { Button } from "@/components/ui/Button";
import { Dot } from "@/components/ui/Dot";
import { useTranslations } from "next-intl";
import { Chip } from "./Chip";
import { Section } from "./Section";

export function HeroSection() {
  const t = useTranslations();
  const { session } = useAuth();

  return (
    <Section>
      <Chip icon={<Dot />} label={t("landing.hero.chip")} gray />
      <h1 className="mt-10">{t("landing.hero.title")}</h1>
      <p className="mt-5 text-base">{t("landing.hero.subtitle")}</p>
      <div className="mt-10 flex items-center gap-4">
        <Button color="dark" href={session ? "/chat" : "/signin"}>
          {t("landing.hero.startAction")}
        </Button>
        <Button color="dark" href="/pricing">
          {t("landing.hero.pricingAction")}
        </Button>
      </div>
    </Section>
  );
}
