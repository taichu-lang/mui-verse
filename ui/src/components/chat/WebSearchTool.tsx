import { Switch } from "@mui-verse/ui/components/inputs";
import { Typography } from "@mui/material";
import { GlobeIcon } from "lucide-react";

export function WebSearchTool({
  defaultChecked = false,
  onSwitch,
}: {
  defaultChecked?: boolean;
  onSwitch: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <GlobeIcon className="text-primary-500 h-4 w-4" />
      <Typography variant="body2" className="mr-2 ml-1.5 leading-4.5">
        Web search
      </Typography>
      <Switch variant="inset" onChange={onSwitch} checked={defaultChecked} />
    </div>
  );
}
