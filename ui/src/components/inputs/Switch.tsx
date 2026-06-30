"use client";

import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
} from "@mui/material";

export type SwitchVariant = "standard" | "inset";

export type SwitchProps = MuiSwitchProps & {
  variant?: SwitchVariant;
  ref?: React.Ref<HTMLButtonElement>;
};

const insetSx = {
  width: 28,
  height: 16,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: "2px",
    "&.Mui-checked": {
      transform: "translateX(12px)",
    },
  },
  "& .MuiSwitch-thumb": {
    width: 12,
    height: 12,
  },
  "& .MuiSwitch-track": {
    borderRadius: "10px",
  },
};

export function Switch({
  variant = "standard",
  disableRipple = true,
  sx,
  ref,
  ...rest
}: SwitchProps) {
  return (
    <MuiSwitch
      ref={ref}
      disableRipple={disableRipple}
      sx={[
        disableRipple && {
          "& .MuiSwitch-switchBase:hover": {
            backgroundColor: "transparent",
          },
          "& .MuiSwitch-switchBase.Mui-checked:hover": {
            backgroundColor: "transparent",
          },
        },
        variant === "inset" && insetSx,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
}
