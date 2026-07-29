import { AnthropicIcon, GeminiIcon, OpenAIIcon } from "@/components/icons";

type ModelProvider = "openai" | "google" | "anthropic";

export interface ModelMeta {
  id: string;
  name: string;
  provider: ModelProvider;
}

export interface Model extends ModelMeta {
  pinned?: boolean;
}

export const models: Model[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
  },
  {
    id: "claude-opus-4-7",
    name: "Claude Opus 4.7",
    provider: "anthropic",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "anthropic",
  },
  {
    id: "claude-opus-4-5",
    name: "Claude Opus 4.5",
    provider: "anthropic",
  },
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "openai",
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "openai",
  },
  {
    id: "gpt-5.4-pro",
    name: "GPT-5.4 Pro",
    provider: "openai",
  },
  {
    id: "gpt-5.3-codex",
    name: "GPT-5.3-Codex",
    provider: "openai",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "openai",
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    provider: "google",
  },
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    provider: "google",
  },
];

export const modelMap: Record<string, ModelMeta> = models.reduce(
  (acc, model) => {
    acc[model.id] = model;
    return acc;
  },
  {} as Record<string, ModelMeta>,
);

export const modelIcons: Record<ModelProvider, React.ElementType> = {
  openai: OpenAIIcon,
  google: GeminiIcon,
  anthropic: AnthropicIcon,
};
