import { modelIcons, modelMap } from "@/lib/types/model";
import { Chip } from "./Chip";
import { Section } from "./Section";

interface ModelProps {
  id: string;
  description: string;
}

function ModelCard({ id, description }: ModelProps) {
  const model = modelMap[id];
  const Icon = modelIcons[model.provider];

  return (
    <div className="flex h-47.5 flex-col gap-3.5 rounded-[30px] px-6 pt-6.5 shadow-(--mui-shadow-border)">
      <Icon className="h-10.5 w-10.5" />
      <p className="text-sm">{model.name}</p>
      <span className="text-text-secondary text-xs text-wrap">
        {description}
      </span>
    </div>
  );
}

export function ModelSection() {
  const models: ModelProps[] = [
    {
      id: "claude-opus-4-7",
      description:
        "Major gains in agentic coding, 1M-token context, and adaptive reasoning depth.",
    },
    {
      id: "gpt-5.4-pro",
      description:
        "A high-performance tier for complex reasoning, focused on output quality and reliability.",
    },
    {
      id: "gemini-3.1-pro-preview",
      description:
        "Excels at hard reasoning tasks, leading on abstract-reasoning benchmarks.",
    },
    {
      id: "gpt-5.3-codex",
      description:
        "An agentic coding model — searches repos, runs commands, debugs autonomously.",
    },
    {
      id: "claude-opus-4-6",
      description:
        "Supports agent-team collaboration, suited for automating complex multi-step tasks.",
    },
    {
      id: "claude-sonnet-4-6",
      description:
        "A balanced model with major coding and instruction-following gains at strong value.",
    },
    {
      id: "gemini-3-flash-preview",
      description:
        "Runs 4x faster while excelling at coding and agentic-task benchmarks.",
    },
    {
      id: "gpt-5.4",
      description:
        "Unifies reasoning, coding, and agentic capabilities for professional workflows.",
    },
  ];

  return (
    <Section id="model">
      <Chip label="Model matrix" gray />
      <p className="mt-7.5 text-2xl font-semibold">
        Supports multiple leading AI models
      </p>
      <p className="text-text-secondary mt-5 text-base">
        Pick the right model for each task — we support{" "}
        <span className="font-semibold">20+</span> models.
      </p>
      <div className="mt-10 grid grid-cols-4 gap-5.5">
        {models.map((model) => (
          <ModelCard {...model} key={model.id} />
        ))}
      </div>
    </Section>
  );
}
