import { SearchIcon } from "@/components/icons";
import { Dialog } from "@/components/ui/Dialog";
import { IconGhostButton } from "@mui-verse/ui/components/buttons";
import {
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from "@mui-verse/ui/components/feedback";
import { CloseXIcon } from "@mui-verse/ui/components/icons";
import { MenuButton } from "@mui-verse/ui/layout/MenuButton";
import { DialogContent, InputBase } from "@mui/material";

function NoResult() {
  return (
    <div className="flex items-center gap-2.5">
      <SearchIcon />
      <span className="text-sm">No results</span>
    </div>
  );
}

export function SearchButton() {
  return (
    <DialogProvider>
      <DialogTrigger>
        <MenuButton title="Search" icon={<SearchIcon />} />
      </DialogTrigger>
      <Dialog>
        <DialogTitle
          enableCloseTrigger={
            <IconGhostButton className="hover:bg-action-hover h-8 w-8">
              <CloseXIcon />
            </IconGhostButton>
          }
        >
          <InputBase fullWidth />
        </DialogTitle>
        <DialogContent>
          <NoResult />
        </DialogContent>
      </Dialog>
    </DialogProvider>
  );
}
