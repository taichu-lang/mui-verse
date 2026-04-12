import { Typography } from "@mui/material";

export function DataItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col text-left md:flex-row md:items-center">
      <Typography className="w-full font-medium text-gray-700 md:w-32">
        {label}
      </Typography>
      <div className="flex-1 rounded-lg bg-gray-200/80 p-1 break-all md:bg-transparent">
        {children}
      </div>
    </div>
  );
}
