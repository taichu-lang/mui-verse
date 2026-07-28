"use client";

import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
import { useState } from "react";
import { Section } from "./Section";

interface FaqProps {
  title: string;
  description: string;
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
          <p className="pt-2.5 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const faqs: FaqProps[] = [
    {
      title: "What’s Plato AI?",
      description:
        "Plato AI is an AI model aggregator platform. With a single account, you can chat with different AI models on one unified interface — no need to switch between platforms. Agent features to support your workflow are coming soon.",
    },
    {
      title: "Which models does Plato AI support?",
      description:
        "We support the latest models from ChatGPT, Claude, Gemini, and more. Our model list is updated in real time as new models are released. Click here to view the full list.",
    },
    {
      title: "How long are chat histories saved?",
      description:
        "Chat histories are saved permanently for both free and paid users. You can access your past conversations anytime.",
    },
    {
      title: "Why do frontier models require credits?",
      description:
        "Frontier models like GPT-5.4 Pro and Claude Opus deliver top-tier performance for more complex, demanding tasks. Because token usage varies significantly with conversation length and complexity, these models are billed with credits based on actual usage.",
    },
    {
      title: "Why it's necessary to enable web search?",
      description:
        "AI is not a continuously updated information database. It relies on its existing knowledge and reasoning capabilities, which means it may not always have the latest information about news, policies, product updates, market trends, and other rapidly changing topics. \n\nWith Web Search enabled, AI can access up-to-date external information sources and provide more accurate responses based on the latest and most relevant information.",
    },
  ];

  return (
    <Section id="faq" white>
      <h2 className="text-center">Frequently Asked Questions</h2>
      <div className="w-faq-width mt-7.5 flex flex-col gap-4">
        {faqs.map((faq) => (
          <Faq key={faq.title} {...faq} />
        ))}
      </div>
    </Section>
  );
}
