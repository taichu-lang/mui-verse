"use client";

import {
  AnthropicIcon,
  GeminiIcon,
  ModelsIcon,
  OpenAIIcon,
  PinnedIcon,
  PinnerIcon,
} from "@/components/icons";
import { useRouter } from "@/i18n/navigation";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import { useChat } from "@mui-verse/ui/components/chat";
import { Accordion } from "@mui-verse/ui/components/feedback";
import { ChevronDownIcon } from "@mui-verse/ui/components/icons";
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
import { Chip, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";

type ModelProvider = "openai" | "google" | "anthropic";

const icons = {
  openai: <OpenAIIcon className="h-full w-full" />,
  google: <GeminiIcon className="h-full w-full" />,
  anthropic: <AnthropicIcon className="h-full w-full" />,
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
    id: "gpt-4.1",
    name: "GPT-4.1",
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
  const router = useRouter();
  const { provider, name } = model;
  const { setSharedState } = useChat();

  const switchModel = () => {
    setSharedState({ model: model.id });
    router.replace(`/chat`);
  };

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
      onClick={switchModel}
    >
      <div className="h-4.5 w-4.5">{icons[provider]}</div>
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
      <div className="h-4.5 w-4.5">{icons[provider]}</div>
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
          <p className="mb-2 ml-2.5 text-sm font-semibold">Models</p>
          {models.map((model) => (
            <DropDownModelMenu key={model.id} model={model} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Accordion title="Models" className="px-2">
      {models.map((model) => (
        <ModelMenuItem key={model.id} model={model} />
      ))}
    </Accordion>
  );
}

export function ModelSelect() {
  const router = useRouter();
  const { model, setSharedState } = useChat();
  const selected = useMemo(
    () => models.find((v) => v.id === model) || models[0],
    [model],
  );

  useEffect(() => {
    if (!model) {
      setSharedState({ model: selected.id });
    }
  }, [model, setSharedState, selected]);

  const handleSwitch = (id: string) => {
    setSharedState({ model: id });
    router.replace(`/chat`);
  };

  return (
    <DropdownMenu side="top" align="start">
      <DropdownMenuTrigger>
        <div className="flex cursor-pointer items-center">
          <div className="h-4 w-4">{icons[selected.provider]}</div>
          <span className="pr-2.5 pl-1.5 text-sm">{selected.name}</span>
          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent shadow="none">
        {models.map((m) => (
          <DropdownMenuItem
            key={m.id}
            className="gap-2.5"
            selected={selected.id === m.id}
            onClick={() => handleSwitch(m.id)}
          >
            <div className="h-4 w-4">{icons[m.provider]}</div>
            {m.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModelBrandCard() {
  const { model } = useChat();
  const selected = models.find((v) => v.id === model) || models[0];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <div className="h-10 w-10">{icons[selected.provider]}</div>
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{selected.name}</span>
        <Chip label={"Official"} />
      </div>
      <span className="text-sm">
        Built on {selected.name}, the Pro version is optimized for high-demand
        scenarios, supporting more complex tasks with exceptional professional
        performance.
      </span>
    </div>
  );
}
