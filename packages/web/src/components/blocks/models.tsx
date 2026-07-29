"use client";

import { useAuth } from "@/auth/auth";
import { ModelsIcon, PinnedIcon, PinnerIcon } from "@/components/icons";
import { useConversationMutations } from "@/hooks/useConversationMutations";
import { getModels } from "@/lib/apis/model";
import { addPinnedModel, unPinModel } from "@/lib/apis/preference";
import { Model, modelIcons, models } from "@/lib/types/model";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "./history/HistoryProvider";

export function ModelMenuItem({ model }: { model: Model }) {
  const { provider, name, pinned = false } = model;
  const { session } = useAuth();
  const history = useHistory();
  const { switchConversation } = useConversationMutations();

  const switchModel = () => {
    switchConversation({ model: model.id });
  };

  const handlePin = async () => {
    if (!session) {
      return;
    }

    if (model.pinned) {
      await unPinModel(session.id, model.id);
    } else {
      await addPinnedModel(session.id, model.id);
    }

    history.refreshModels();
  };

  const Icon = modelIcons[provider];

  return (
    <MenuItem
      actions={
        <IconGhostButton
          className={cn("h-full w-8 opacity-0 group-hover:opacity-100", {
            "opacity-100": pinned,
          })}
          onClick={handlePin}
        >
          {pinned ? (
            <PinnedIcon className="text-primary-500" />
          ) : (
            <PinnerIcon />
          )}
        </IconGhostButton>
      }
      onClick={switchModel}
    >
      {<Icon className="h-4.5 w-4.5" />}
      {name}
    </MenuItem>
  );
}

function DropDownModelMenu({
  model,
  onRefresh,
}: {
  model: Model;
  onRefresh: () => void;
}) {
  const { provider, name, pinned = false } = model;
  const { onClose } = useDropdownMenu();
  const { session } = useAuth();
  const { switchConversation } = useConversationMutations();

  const handleSelected = () => {
    switchConversation({ model: model.id });
    onClose();
  };

  const handlePinned = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!session) {
      return;
    }

    if (!session) {
      return;
    }

    if (model.pinned) {
      await unPinModel(session.id, model.id);
    } else {
      await addPinnedModel(session.id, model.id);
    }

    onRefresh();
  };

  const Icon = modelIcons[provider];

  return (
    <div
      className="hover:bg-action-hover flex h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2.5"
      onClick={handleSelected}
    >
      <Icon className="h-4.5 w-4.5" />
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
  const { session } = useAuth();
  const [models, setModels] = useState<Model[]>([]);

  const refresh = useCallback(() => {
    getModels(session?.id).then(setModels);
  }, [session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (collapsed) {
    return (
      <DropdownMenu side="right" align="start">
        <DropdownMenuTrigger>
          <MenuButton title="Models" icon={<ModelsIcon />} />
        </DropdownMenuTrigger>
        <DropdownMenuContent sx={{ minWidth: "230px", px: "8px" }}>
          <p className="mb-2 ml-2.5 text-sm font-semibold">Models</p>
          {models.map((model) => (
            <DropDownModelMenu
              key={model.id}
              model={model}
              onRefresh={refresh}
            />
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
  const { model, setChat } = useChat();
  const { switchConversation } = useConversationMutations();
  const selected = useMemo(
    () => models.find((v) => v.id === model) || models[0],
    [model],
  );

  useEffect(() => {
    if (!model) {
      setChat({ model: selected.id });
    }
  }, [model, setChat, selected]);

  const handleSwitch = (id: string) => {
    switchConversation({ model: id });
  };

  const Icon = modelIcons[selected.provider];

  const modelIcon = (m: Model) => {
    const Comp = modelIcons[m.provider];
    return <Comp className="h-4 w-4" />;
  };

  return (
    <DropdownMenu side="top" align="start">
      <DropdownMenuTrigger>
        <div className="flex cursor-pointer items-center">
          <Icon className="h-4 w-4" />
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
            {modelIcon(m)}
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
  const Icon = modelIcons[selected.provider];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <Icon className="h-10 w-10" />
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
