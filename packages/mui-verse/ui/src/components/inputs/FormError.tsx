import { Typography } from "@mui/material";

export function FormError({
  message,
  show = true,
}: {
  message: string | null;
  show?: boolean;
}) {
  if (message && show) {
    return (
      <Typography
        color="error"
        variant="caption"
        flexWrap={"wrap"}
        className="ml-3"
      >
        {message}
      </Typography>
    );
  }

  return null;
}
