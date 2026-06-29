"use client";

import { AnthropicIcon } from "@/components/icons/AnthropicIcon";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { ModelsIcon } from "@/components/icons/ModelsIcon";
import { OpenAIIcon } from "@/components/icons/OpenAIIcon";
import { PinnedIcon, PinnerIcon } from "@/components/icons/PinnerIcon";
import { Accordion } from "@/components/ui/Accordion";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  useDropdownMenu,
} from "@mui-verse/ui/components/navigation";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { cn } from "@mui-verse/ui/utils/cn";
import { Typography } from "@mui/material";

type ModelProvider = "openai" | "google" | "anthropic";

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
}

const models: Model[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "anthropic",
  },
  {
    id: "claude-sonnet-4-5-20250929",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
  },
  {
    id: "claude-haiku-4-5-20251001",
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
    id: "gpt-5.3-codex",
    name: "GPT-5.3-Codex",
    provider: "openai",
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    provider: "google",
  },
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash Preview",
    provider: "google",
  },
];

export function ModelMenu({
  model,
  pinned = false,
}: {
  model: Model;
  pinned?: boolean;
}) {
  const { provider, name } = model;

  const icon = () => {
    switch (provider) {
      case "anthropic":
        return <AnthropicIcon />;

      case "openai":
        return <OpenAIIcon />;

      case "google":
        return <GeminiIcon />;
    }
  };

  return (
    <MenuButton
      title={name}
      icon={icon()}
      actions={
        <IconGhostButton
          className={cn("opacity-0 hover:opacity-100", {
            "opacity-100": pinned,
          })}
        >
          {pinned ? (
            <PinnedIcon className="text-primary-500" />
          ) : (
            <PinnerIcon />
          )}
        </IconGhostButton>
      }
    />
  );
}

function DropDownModelMenu({
  model,
  pinned = false,
}: {
  model: Model;
  pinned?: boolean;
}) {
  const { provider, name } = model;
  const { onClose } = useDropdownMenu();

  const icon = () => {
    switch (provider) {
      case "anthropic":
        return <AnthropicIcon />;

      case "openai":
        return <OpenAIIcon />;

      case "google":
        return <GeminiIcon />;
    }
  };

  const handleSelected = () => {
    onClose();
  };

  const handlePinned = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="hover:bg-action-hover flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2.5"
      onClick={handleSelected}
    >
      {icon()}
      <Typography variant="body2" className="leading-4.5">
        {name}
      </Typography>
      <div className="flex-1" />
      <IconGhostButton
        className={cn("opacity-0 hover:opacity-100", {
          "opacity-100": pinned,
        })}
        onClick={handlePinned}
      >
        {pinned ? <PinnedIcon className="text-primary-500" /> : <PinnerIcon />}
      </IconGhostButton>
    </div>
  );
}

export function ModelAccordion() {
  const { collapsed } = useSidebar();

  if (collapsed) {
    return (
      <DropdownMenu side="right" align="start">
        <DropdownMenuTrigger>
          <MenuButton title="Models" icon={<ModelsIcon />} />
        </DropdownMenuTrigger>
        <DropdownMenuContent sx={{ minWidth: "230px", px: "8px" }}>
          <p className="anna-text-tag mb-2 ml-2.5 font-semibold">Models</p>
          {models.map((model) => (
            <DropDownModelMenu key={model.id} model={model} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Accordion title="Models" className="mb-4">
      {models.map((model) => (
        <ModelMenu key={model.id} model={model} pinned />
      ))}
    </Accordion>
  );
}
