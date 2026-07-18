import { UpgradeCard } from "@/components/blocks/benefit/UpgradeCard";
import {
  AdvancedIcon,
  CreditIcon,
  QuestionCircleIcon,
  RocketIcon,
  StandardIcon,
} from "@/components/icons";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mui-verse/ui/components/navigation";
import { Divider } from "@mui/material";

function QuotaTip({
  quota,
  limit,
  category,
}: {
  quota: number;
  limit: number;
  category: string;
}) {
  return (
    <Popover side="top" align="center">
      <PopoverTrigger>
        <div>
          <QuestionCircleIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent
        sx={{ width: "387px", px: "18px", py: "14px", mt: "-8px" }}
      >
        <div className="flex flex-col">
          <span className="text-base font-medium">{category}</span>
          <div className="mt-2.25 flex items-center justify-between">
            <span className="text-sm">Available monthly queries</span>
            <span className="text-sm">
              {quota}/{limit}
            </span>
          </div>
          <Divider className="my-3.5" />
          <span className="text-text-secondary text-sm">
            Standard queries are used for basic models such as Claude 4.5 Haiku
            or Gemini 3.1 Flash-Lite. Monthly queries reset on the 1st of each
            month.
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CategoryUsage({
  Icon,
  title,
  tip,
  quota,
}: {
  Icon: React.ElementType;
  title: string;
  tip: React.ReactNode;
  quota: number;
}) {
  return (
    <div className="flex items-center">
      <Icon />
      <span className="mr-2 ml-2.5">{title}</span>
      {tip}
      <div className="flex-1"></div>
      <span className="text-sm">{quota}</span>
    </div>
  );
}

export function ProPlanUsage() {
  return (
    <Popover align="center" side="top">
      <PopoverTrigger>
        <IconGhostButton className="hover:bg-action-hover gap-1.5 rounded-full px-2 py-1">
          <CreditIcon />
          <span className="text-text-secondary text-sm">200</span>
        </IconGhostButton>
      </PopoverTrigger>
      <PopoverContent
        sx={{ width: "308px", px: "16px", py: "14px", mt: "-10px" }}
      >
        <div className="flex flex-col gap-4 p-0">
          <p className="text-base">Pro Plan</p>
          <Divider className="-my-2" />
          <CategoryUsage
            Icon={StandardIcon}
            title="Standard queries"
            tip={
              <QuotaTip
                quota={2345}
                limit={20000}
                category="Standard queries"
              />
            }
            quota={2345}
          />
          <CategoryUsage
            Icon={AdvancedIcon}
            title="Advanced queries"
            tip=""
            quota={135}
          />
          <CategoryUsage
            Icon={CreditIcon}
            title="Credits"
            tip=""
            quota={1423}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function FreePlanUsage() {
  return (
    <div className="flex items-center gap-2.5">
      <Popover align="center" side="top">
        <PopoverTrigger>
          <IconGhostButton className="hover:bg-action-hover gap-1.5 rounded-full px-2 py-1">
            <RocketIcon />
            <span className="text-text-secondary text-sm">Upgrade</span>
          </IconGhostButton>
        </PopoverTrigger>
        <PopoverContent
          sx={{
            px: 0,
            py: 0,
            mt: "-10px",
            width: "395px",
            minHeight: "346px", // height is needed, due to UpgradeCard has conditional render.
          }}
        >
          <UpgradeCard />
        </PopoverContent>
      </Popover>
      <Popover align="center" side="top">
        <PopoverTrigger>
          <IconGhostButton className="hover:bg-action-hover gap-1.5 rounded-full px-2 py-1">
            <StandardIcon />
            <span className="text-text-secondary text-sm">200</span>
          </IconGhostButton>
        </PopoverTrigger>
        <PopoverContent
          sx={{ width: "308px", px: "16px", py: "14px", mt: "-10px" }}
        >
          <div className="flex flex-col gap-4 p-0">
            <p className="text-base">Free Plan</p>
            <Divider className="-my-2" />
            <CategoryUsage
              Icon={StandardIcon}
              title="Standard queries"
              tip={
                <QuotaTip
                  quota={2345}
                  limit={20000}
                  category="Standard queries"
                />
              }
              quota={2345}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function PlanUsage() {
  return <FreePlanUsage />;
}
