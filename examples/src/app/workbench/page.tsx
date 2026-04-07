import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mui-verse/ui/components/DropdownMenu";
import { Box, Button, Typography } from "@mui/material";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Typography variant="h1" component={"h1"}>
        An example of mui-verse
      </Typography>
      <DropdownMenu side="bottom">
        <DropdownMenuTrigger>
          <Button>adonia12@126.com</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Box height={1024}></Box>
    </div>
  );
}
