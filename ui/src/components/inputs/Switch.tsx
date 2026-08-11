"use client";

import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
} from "@mui/material";

export type SwitchVariant = "standard" | "inset";

export type SwitchProps = Omit<MuiSwitchProps, "onChange"> & {
  variant?: SwitchVariant;
  ref?: React.Ref<HTMLButtonElement>;
  onChange?: (checked: boolean) => void;
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
  onChange,
  sx,
  ref,
  ...rest
}: SwitchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <MuiSwitch
      onChange={handleChange}
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
