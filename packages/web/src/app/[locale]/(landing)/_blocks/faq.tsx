"use client";

import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AnchorLink } from "./AnchorLink";
import { Section } from "./Section";

interface FaqProps {
  title: string;
  description: React.ReactNode;
}

function Faq({ title, description }: FaqProps) {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <div
      className="group cursor-pointer rounded-[30px] px-5 py-4.5 shadow-(--mui-shadow-border)"
      onClick={() => setExpand(!expand)}
      data-collapse={expand ? undefined : "true"}
    >
      <div className="flex items-center justify-between">
        <p className="text-base">{title}</p>
        <ChevronDownIcon className="transition-transform duration-300 group-data-collapse:-rotate-90" />
      </div>
      <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out group-data-collapse:grid-rows-[0fr]">
        <div className="overflow-hidden">
          <p className="pt-2.5 text-sm whitespace-pre-line">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const t = useTranslations();

  const faqs: FaqProps[] = [
    {
      title: t("landing.faq.what.q"),
      description: t("landing.faq.what.a"),
    },
    {
      title: t("landing.faq.which.q"),
      description: t.rich("landing.faq.which.a", {
        link: (anchor) => {
          return (
            <AnchorLink href="/pricing#features" className="underline">
              {anchor}
            </AnchorLink>
          );
        },
      }),
    },
    {
      title: t("landing.faq.history.q"),
      description: t("landing.faq.history.a"),
    },
    {
      title: t("landing.faq.frontier.q"),
      description: t("landing.faq.frontier.a"),
    },
    {
      title: t("landing.faq.search.q"),
      description: t("landing.faq.search.a"),
    },
  ];

  return (
    <Section id="faq" white>
      <h2 className="text-center">{t("landing.faq.title")}</h2>
      <div className="w-faq-width mt-7.5 flex flex-col gap-4">
        {faqs.map((faq) => (
          <Faq key={faq.title} {...faq} />
        ))}
      </div>
    </Section>
  );
}
