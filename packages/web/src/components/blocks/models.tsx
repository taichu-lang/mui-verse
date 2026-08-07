"use client";

import { useAuth } from "@/auth/auth";
import { ModelsIcon, PinnedIcon, PinnerIcon } from "@/components/icons";
import { useBalance } from "@/hooks/useBalance";
import { useBenefit } from "@/hooks/useBenefit";
import { useConversationMutations } from "@/hooks/useConversationMutations";
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
import { Tooltip, TooltipProps, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useTransition } from "react";
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
      await unPinModel(model.id);
    } else {
      await addPinnedModel(model.id);
    }

    history.refreshModels();
  };

  const Icon = modelIcons[provider];

  return (
    <ModelAvailability model={model.id} placement="top-end">
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
    </ModelAvailability>
  );
}

// TODO(Leo): use ModelMenuItem instead?
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

    if (model.pinned) {
      await unPinModel(model.id);
    } else {
      await addPinnedModel(model.id);
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
  const t = useTranslations();
  const { collapsed } = useSidebar();
  const [models, setModels] = useState<Model[]>([]);
  const { getPreferredModels } = useBenefit();

  const refresh = useCallback(() => {
    getPreferredModels().then(setModels);
  }, [getPreferredModels]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (collapsed) {
    return (
      <DropdownMenu side="right" align="start">
        <DropdownMenuTrigger>
          <MenuButton title={t("chat.sidebar.models")} icon={<ModelsIcon />} />
        </DropdownMenuTrigger>
        <DropdownMenuContent sx={{ minWidth: "fit-content", px: "8px" }}>
          <p className="mb-2 ml-2.5 text-sm font-semibold">
            {t("chat.sidebar.models")}
          </p>
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
  const { getPreferredModels } = useBenefit();
  const [models, setModels] = useState<Model[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const ms = await getPreferredModels();
      setModels(ms);
    });
  }, [getPreferredModels, setModels]);

  useEffect(() => {
    if (models.length === 0) {
      return;
    }

    if (!model) {
      setChat({ model: models[0].id });
    }
  }, [models, setChat, model]);

  if (isPending || models.length === 0) {
    return null;
  }

  const handleSwitch = (id: string) => {
    switchConversation({ model: id });
  };

  const selectedModel = models.find((m) => m.id === model) || models[0];
  const Icon = modelIcons[selectedModel.provider];

  const modelIcon = (m: Model) => {
    const Comp = modelIcons[m.provider];
    return <Comp className="h-4 w-4" />;
  };

  return (
    <DropdownMenu side="top" align="start">
      <DropdownMenuTrigger>
        <div className="flex cursor-pointer items-center">
          <Icon className="h-4 w-4" />
          <span className="pr-2.5 pl-1.5 text-sm">{selectedModel.name}</span>
          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent shadow="none">
        {models.map((m) => (
          <ModelAvailability model={m.id} key={m.id}>
            <DropdownMenuItem
              selected={model === m.id}
              onClick={() => handleSwitch(m.id)}
            >
              {modelIcon(m)}
              {m.name}
            </DropdownMenuItem>
          </ModelAvailability>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModelBrandCard() {
  const t = useTranslations();
  const { model } = useChat();
  const selected = models.find((v) => v.id === model) || models[0];
  const Icon = modelIcons[selected.provider];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <Icon className="h-10 w-10" />
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="text-xl">{selected.name}</span>
        <div className="bg-action-hover flex items-center self-stretch rounded-lg px-1.5">
          <span className="text-xs">{t("models.official")}</span>
        </div>
      </div>
      <span className="text-sm">{t(`models.${selected.i18n}`)}</span>
    </div>
  );
}

function ModelAvailability({
  model,
  children,
  placement = "right",
}: {
  model: string;
  children: React.ReactElement;
  placement?: TooltipProps["placement"];
}) {
  const t = useTranslations();
  const { standard, advanced, frontier } = useBalance();
  const { availableModels } = useBenefit();
  const session = useAuth((s) => s.session);

  if (!session) {
    return children;
  }

  const plan = session.subscription.plan_code;
  const benefit = availableModels.find((m) => m.id === model);
  if (!benefit) {
    return children;
  }

  let remaining = 0;
  switch (benefit.benefit_code) {
    case "basic_models":
      remaining = standard?.remaining || 0;
      break;
    case "advanced_models":
      remaining = advanced?.remaining || 0;
      break;
    case "frontier_models":
      remaining = frontier?.remaining || 0;
      break;
    default:
      break;
  }

  const tip =
    remaining > 0
      ? t("balance.modelAvailable")
      : t(`balance.modelUnavailable.${plan}`);

  return (
    <Tooltip title={tip} placement={placement}>
      {children}
    </Tooltip>
  );
}
