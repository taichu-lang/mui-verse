"use client";

import {
  AnthropicIcon,
  ChevronDownIcon,
  GeminiIcon,
  ModelsIcon,
  OpenAIIcon,
  PinnedIcon,
  PinnerIcon,
} from "@/components/icons";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  MenuItem,
  useDropdownMenu,
} from "@mui-verse/ui/components/navigation";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { useSidebar } from "@mui-verse/ui/layout/useSidebar";
import { cn } from "@mui-verse/ui/utils/cn";
import { Typography } from "@mui/material";
import { useState } from "react";

type ModelProvider = "openai" | "google" | "anthropic";

const icons = {
  openai: <OpenAIIcon />,
  google: <GeminiIcon />,
  anthropic: <AnthropicIcon />,
};

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
}

export const models: Model[] = [
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

export function ModelMenuItem({
  model,
  pinned = false,
}: {
  model: Model;
  pinned?: boolean;
}) {
  const { provider, name } = model;

  return (
    <MenuItem
      className="gap-2.5"
      actions={
        <div
          className={cn(
            "flex h-full w-8 items-center justify-center p-0 opacity-0 hover:opacity-100",
            {
              "opacity-100": pinned,
            },
          )}
        >
          {pinned ? (
            <PinnedIcon className="text-primary-500" />
          ) : (
            <PinnerIcon />
          )}
        </div>
      }
    >
      {icons[provider]}
      {name}
    </MenuItem>
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
      {icons[provider]}
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

  if (!collapsed) return null;

  return (
    <DropdownMenu side="right" align="start">
      <DropdownMenuTrigger>
        <MenuButton title="Models" icon={<ModelsIcon />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent sx={{ minWidth: "230px", px: "8px" }}>
        <p className="mb-2 ml-2.5 text-sm font-semibold">Models</p>
        {models.map((model) => (
          <DropDownModelMenu key={model.id} model={model} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModelSelect() {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);

  return (
    <DropdownMenu side="top" align="start">
      <DropdownMenuTrigger>
        <div className="flex cursor-pointer items-center">
          {icons[selectedModel.provider]}
          <span className="pr-2.5 pl-1.5 text-sm">{selectedModel.name}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent shadow="none">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className="gap-2.5"
            selected={selectedModel.id === model.id}
            onClick={() => setSelectedModel(model)}
          >
            {icons[model.provider]}
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
