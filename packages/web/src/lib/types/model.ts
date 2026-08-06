import { AnthropicIcon, GeminiIcon, OpenAIIcon } from "@/components/icons";
import { BenefitCode } from "./enums";

type ModelProvider = "openai" | "google" | "anthropic";

export interface ModelMeta {
  id: string;
  name: string;
  provider: ModelProvider;
  i18n: string;
}

export interface Model extends ModelMeta {
  pinned?: boolean;
  benefit_code: BenefitCode;
}

// `.` can not be keys of namespace in next-intl.
export const models: ModelMeta[] = [
  {
    id: "gpt-4.1-nano",
    name: "GPT-4.1 nano",
    provider: "openai",
    i18n: "gpt-4-1-nano",
  },
  {
    id: "gpt-5.4-nano",
    name: "GPT-5.4 nano",
    provider: "openai",
    i18n: "gpt-5-4-nano",
  },
  {
    id: "gpt-5.4-mini",
    name: "GPT-5.4 mini",
    provider: "openai",
    i18n: "gpt-5-4-mini",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    i18n: "gpt-4o",
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "openai",
    i18n: "gpt-5-4",
  },
  {
    id: "gpt-5.3-codex",
    name: "GPT-5.3-Codex",
    provider: "openai",
    i18n: "gpt-5-3-codex",
  },
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "openai",
    i18n: "gpt-5-5",
  },
  {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    provider: "openai",
    i18n: "gpt-5-6-luna",
  },
  {
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    provider: "openai",
    i18n: "gpt-5-6-terra",
  },
  {
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    provider: "openai",
    i18n: "gpt-5-6-sol",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    i18n: "claude-haiku-4-5",
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
    i18n: "claude-sonnet-4-6",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    i18n: "claude-sonnet-4-5",
  },
  {
    id: "claude-opus-4-7",
    name: "Claude Opus 4.7",
    provider: "anthropic",
    i18n: "claude-opus-4-7",
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "anthropic",
    i18n: "claude-opus-4-6",
  },
  {
    id: "claude-opus-4-5",
    name: "Claude Opus 4.5",
    provider: "anthropic",
    i18n: "claude-opus-4-5",
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    provider: "google",
    i18n: "gemini-3-1-pro-preview",
  },
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    provider: "google",
    i18n: "gemini-3-flash-preview",
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
