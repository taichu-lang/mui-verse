import { cn } from "@mui-verse/ui/utils/cn";
import { Avatar, AvatarProps, Typography } from "@mui/material";

export function AvatarCard({
  avatar,
  title,
  subheader,
  className,
}: {
  avatar: AvatarProps;
  title: React.ReactNode;
  subheader?: React.ReactNode;
  className?: string;
}) {
  const { sx, ...rest } = avatar;
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Avatar {...rest} sx={{ width: 36, height: 36, ...sx }}></Avatar>
      <div className="flex flex-col">
        {typeof title === "string" ? (
          <Typography variant="subtitle1">{title}</Typography>
        ) : (
          title
        )}
        {subheader &&
          (typeof subheader === "string" ? (
            <Typography variant="body2" color="text.secondary">
              {subheader}
            </Typography>
          ) : (
            subheader
          ))}
      </div>
    </div>
  );
}
