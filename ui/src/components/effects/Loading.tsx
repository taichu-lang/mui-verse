import { CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <CircularProgress size={20} />
    </div>
  );
}
