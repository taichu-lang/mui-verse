import { Dialog } from "@/components/ui/Dialog";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from "@mui-verse/ui/components/feedback";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { DialogContent, InputBase } from "@mui/material";
import { SearchIcon } from "lucide-react";

function NoResult() {
  return (
    <div className="flex items-center gap-2.5">
      <SearchIcon className="h-4 w-4" />
      <span className="anna-text-tag">No results</span>
    </div>
  );
}

export function SearchButton() {
  return (
    <DialogProvider>
      <DialogTrigger>
        <MenuButton title="Search" icon={<SearchIcon className="h-4 w-4" />} />
      </DialogTrigger>
      <Dialog>
        <DialogTitle enableCloseTrigger={<IconGhostButton />}>
          <InputBase fullWidth />
        </DialogTitle>
        <DialogContent>
          <NoResult />
        </DialogContent>
      </Dialog>
    </DialogProvider>
  );
}
